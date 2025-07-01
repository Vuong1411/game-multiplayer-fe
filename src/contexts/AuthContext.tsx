import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, authService } from '@project/services';
import { User } from '@project/types/user';
import { setCookie, getCookie, deleteCookie } from '@project/utils/Cookie';

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Kiểm tra token khi ứng dụng khởi chạy
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            try {
                const token = getCookie('authToken');
                const authUser = getCookie('authUser');

                // Không có token -> chưa đăng nhập
                if (!token) {
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                    return;
                }

                if (authUser) {
                    try {
                        const userData: User = JSON.parse(authUser);
                        setCurrentUser(userData);
                        setIsAuthenticated(true);
                        return;
                    } catch (parseError) {
                        console.error('Failed to parse user data:', parseError);
                        deleteCookie('authUser');
                    }
                }

                // Có token nhưng không có user data -> verify với API
                const userData = await authService.me();
                if (userData) {
                    setCookie('authUser', JSON.stringify(userData), 7);
                    setCurrentUser(userData);
                    setIsAuthenticated(true);
                } else {
                    deleteCookie('authToken');
                    deleteCookie('authUser');
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }

            } catch (error) {
                console.error("Failed to verify auth status:", error);
                deleteCookie('authToken');
                deleteCookie('authUser');
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData: User, token: string) => {
        setCookie('authToken', token, 7);
        setCookie('authUser', JSON.stringify(userData), 7);
        setCurrentUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            // Xóa cookie
            deleteCookie('authToken');
            deleteCookie('authUser');

            // Reset state
            setCurrentUser(null);
            setIsAuthenticated(false);

            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const reloadUser = async () => {
        try {
            const userData = await userService.getById(currentUser?.id || 0);
            if (userData) {
                setCookie('authUser', JSON.stringify(userData), 7);
                setCurrentUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Failed to reload user:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading, login, logout, reloadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};