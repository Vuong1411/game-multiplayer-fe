import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@project/services/auth.service';
import { User } from '@project/types/user';

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Bắt đầu với trạng thái loading

    // Kiểm tra token khi ứng dụng khởi chạy
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const authUser = localStorage.getItem('authUser');
                if (token) {
                    if (authUser) {
                        const userData: User = JSON.parse(authUser);
                        setCurrentUser(userData);
                        setIsAuthenticated(true);
                        setIsLoading(false);
                    }
                    const userData = await authService.me();
                    if (userData) {
                        setCurrentUser(userData);
                        localStorage.setItem('authUser', JSON.stringify(userData));
                    } else {
                        // Token không hợp lệ
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('authUser');
                        setCurrentUser(null);
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error("Failed to verify auth status:", error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setCurrentUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem('authToken', token); // Lưu token
        localStorage.setItem('authUser', JSON.stringify(userData)); // Lưu thông tin người dùng
        setCurrentUser(userData);
        setIsAuthenticated(true);
        console.log("AuthContext: User logged in", userData);
    };

    const logout = async () => {
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setCurrentUser(null);
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading, login, logout }}>
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