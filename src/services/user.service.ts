import axios from 'axios';
import { publicApi, privateApi } from './api';
import { User } from '@project/types/user';
import { API_CONFIG } from '@project/config/api.config';
import { uploadToCloudinary } from '@project/utils/Cloudinary';

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
    updateProfile: async (data: Partial<User> & { avatarFile?: File }) => {
        try {
            // Nếu có file ảnh mới, upload lên Cloudinary trước
            if (data.avatarFile) {
                const imageUrl = await uploadToCloudinary(data.avatarFile, 'avatars');
                if (imageUrl) {
                    data.avatar_url = imageUrl;
                } else {
                    throw new Error('Failed to upload avatar!');
                }
                delete data.avatarFile;
            }
            
            const response = await privateApi.put(API_CONFIG.endpoints.user.updateProfile, data);
            if (response.data?.success) {
                return response.data.message;
            }

            throw new Error(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            console.error('Failed to update profile!', error);
            return false;
        }
    },

    /**
     * Thay đổi mật khẩu người dùng
     * @param oldPassword Mật khẩu cũ
     * @param newPassword Mật khẩu mới
     * @returns Trạng thái thành công của việc thay đổi mật khẩu
     */
    changePassword: async (oldPassword: string, newPassword: string) => {
        try {
            const response = await privateApi.post(API_CONFIG.endpoints.user.changePassword, { oldPassword, newPassword });
            if (response.data?.success) {
                return response.data.message;
            }

            throw new Error(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            console.error('Failed to change password!', error);
            return false;
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