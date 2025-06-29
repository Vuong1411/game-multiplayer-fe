import { publicApi, privateApi } from './api';
import { User } from '@project/types/user';
import { API_CONFIG } from '@project/config/api.config';

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
    try {
      const response = await publicApi.post<AuthResponse>(API_CONFIG.endpoints.auth.login, { email, password });
      if (response.data?.success && response.data.user && response.data.token) {
        return { user: response.data.user, token: response.data.token };
      }
      return null;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Login failed!');
    }
  },

  register: async (user: Partial<User>): Promise<User | null> => {
    try {
      const response = await publicApi.post<AuthResponse>(API_CONFIG.endpoints.auth.register, user);
      if (response.data?.success && response.data.user) {
        return response.data.user;
      }
      return null;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Registration failed!');
    }
  },

  me: async (): Promise<User | null> => {
    try {
      const response = await privateApi.get<AuthResponse>(API_CONFIG.endpoints.auth.me);
      if (response.data?.success && response.data.user) {
        return response.data.user;
      }
      return null;
    } catch (error: any) {
      console.error('Token verification failed:', error);
      return null;
    }
  },

  googleLogin: async (credential: string): Promise<{ user: User; token: string } | null> => {
    try {
      const response = await publicApi.post<AuthResponse>(API_CONFIG.endpoints.auth.googleLogin, {
        credential,
      });
      if (response.data?.success && response.data.user && response.data.token) {
        return { user: response.data.user, token: response.data.token };
      }
      return null;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Google login failed!');
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await publicApi.post<{ success: boolean; message: string }>(
        API_CONFIG.endpoints.auth.forgotPassword,
        { email }
      );
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Gửi yêu cầu thất bại!');
    }
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      await publicApi.post<{ success: boolean; message: string }>(
        API_CONFIG.endpoints.auth.resetPassword,
        { token, newPassword: password }
      );
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Đặt lại mật khẩu thất bại!');
    }
  },
};
