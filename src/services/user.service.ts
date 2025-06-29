import { publicApi } from './api';
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

    
};