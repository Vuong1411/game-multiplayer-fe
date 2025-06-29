import { publicApi, privateApi } from './api';
import { User } from '@project/types/user';
import { API_CONFIG } from '@project/config/api.config';
import axios from 'axios';

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

     * Tạo mới người dùng
     * @param user Dữ liệu người dùng mới
     * @returns Thông tin người dùng đã tạo
     */
    create: async (user: Partial<User>): Promise<User> => {
        try {
            const response = await privateApi.post<UserResponse>(API_CONFIG.endpoints.user.create, user);

            if (response.data?.success) {
                return response.data.user;
            }

            throw new Error(response.data.message);
        } catch (error) {
            console.error('Failed to create user!', error);
            throw new Error('Failed to create user!');
        }
    },

    /**
     * Cập nhật thông tin người dùng (admin)
     * @param user Thông tin người dùng cần cập nhật
     * @returns Thông tin người dùng đã cập nhật
     */
    update: async (id: number, user: Partial<User>) => {
        try {
            const response = await privateApi.put<UserResponse>(API_CONFIG.endpoints.user.update(id), user);

            if (response.data?.success) {
                return response.data.message;
            }

            throw new Error(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            console.error('Failed to update user!', error);
            throw new Error('Failed to update user!');
        }
    },

    /**
     * Cập nhật thông tin người dùng hiện tại
     * @param user Thông tin người dùng cần cập nhật
     * @returns Thông tin người dùng hiện tại
     */
    profile: async (user: User) => {
        try {
            const response = await privateApi.put<UserResponse>(API_CONFIG.endpoints.user.profile, user);
            if (response.data?.success) {
                return response.data.message;
            }

            throw new Error(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            console.error('Failed to fetch user profile!', error);
            throw new Error('Failed to fetch user profile!');
        }
    },

    /**
     * Xoá người dùng theo ID
     * @param id ID của người dùng cần xoá
     * @returns Thông tin người dùng đã xoá
     */
    delete: async (id: number) => {
        try {
            const response = await privateApi.delete<UserResponse>(API_CONFIG.endpoints.user.delete(id));

            if (response.data?.success) {
                return response.data.message;
            }

            throw new Error(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            console.error(`Failed to delete user with id: ${id}!`, error);
            throw new Error(`Failed to delete user with id: ${id}!`);
        }
    },
};