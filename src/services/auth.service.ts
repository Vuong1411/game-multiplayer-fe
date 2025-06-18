import { publicApi, privateApi } from './api';
import { User } from '@project/types/user';
import { API_CONFIG } from '@project/config/api.config';

interface AuthResponse {
    success: boolean;
    user: User;
    token: string;
}
export const authService = {
    /**
     * Đăng nhập người dùng
     * @param email Email của người dùng
     * @param password Mật khẩu của người dùng
     * @returns Thông tin người dùng nếu đăng nhập thành công
     */
    login: async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
        try {
            const response = await publicApi.post<AuthResponse>(API_CONFIG.endpoints.auth.login, { email, password });
            if (response.data?.success) {
                return { user: response.data.user, token: response.data.token };
            }
            return null;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || 'Login failed!');
        }
    },

    /**
     * Đăng ký người dùng mới
     * @param user Dữ liệu người dùng mới
     * @returns Thông tin người dùng nếu đăng ký thành công
     */
    register: async (user: Partial<User>): Promise<User | null> => {
        try {
            const response = await publicApi.post<AuthResponse>(API_CONFIG.endpoints.auth.register, user);
            if (response.data?.success) {
                return response.data.user;
            }
            return null;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || 'Registration failed!');
        }
    },
    /**
     * Lấy thông tin người dùng hiện tại
     * @returns Thông tin người dùng nếu đã đăng nhập
     */
    me: async (): Promise<User | null> => {
        try {
            const response = await privateApi.get<AuthResponse>(API_CONFIG.endpoints.auth.me);
            if (response.data?.success) {
                return response.data.user;
            }
            return null;
        } catch (error: any) {
            console.error('Token verification failed:', error);
            return null;
        }
    },
};