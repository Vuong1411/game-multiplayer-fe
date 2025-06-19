import { publicApi, privateApi } from './api';
import { User } from '@project/types/user';
import { API_CONFIG } from '@project/config/api.config';

interface UsersResponse {
    success: boolean;
    users: User[];
    message: string;
}

interface UserResponse {
    success: boolean;
    user: User;
    message: string;
}

export const userService = {

    /**
     * Lấy tất cả người dùng
     * @returns Danh sách người dùng
     */
    getAll: async (): Promise<User[]> => {
        try {
            const response = await publicApi.get<UsersResponse>(API_CONFIG.endpoints.user.getAll);

            if (response.data?.success) {
                return response.data.users;
            }

            return [];
        } catch (error) {
            console.error('Failed to fetch users!', error);
            throw new Error('Failed to fetch users!');
        }
    },

    /**
     * Lấy thông tin người dùng theo ID
     * @param id ID của người dùng
     * @returns Thông tin người dùng tương ứng với ID
     */
    getById: async (id: number): Promise<User | null> => {
        try {
            const response = await publicApi.get<UserResponse>(API_CONFIG.endpoints.user.getById(id));

            if (response.data?.success) {
                return response.data.user;
            }

            return null;
        } catch (error) {
            console.error(`Failed to fetch user with id: ${id}!`, error);
            throw new Error(`Failed to fetch user with id: ${id}!`);
        }
    },

    /**
     * Cập nhật thông tin user (username, email)
     */
    updateProfile: async (data: { userId: string; email?: string; username?: string }): Promise<boolean> => {
        try {
            const response = await privateApi.put(API_CONFIG.endpoints.user.updateProfile, data);
            return response.data?.success ?? false;
        } catch (error) {
            console.error('Failed to update profile!', error);
            return false;
        }
    },

    /**
     * Đổi mật khẩu
     */
    changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
        try {
            const response = await privateApi.post(API_CONFIG.endpoints.user.changePassword, { oldPassword, newPassword });
            return response.data?.success ?? false;
        } catch (error) {
            console.error('Failed to change password!', error);
            return false;
        }
    },
};