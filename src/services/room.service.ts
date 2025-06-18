import { publicApi, privateApi } from './api';
import { Room } from '@project/types/room';
import { API_CONFIG } from '@project/config/api.config';

interface RoomsResponse {
    success: boolean;
    rooms: Room[];
    message: string;
}

interface RoomResponse {
    success: boolean;
    room: Room;
    room_id: number;
    pin: string;
    message: string;
}

export const roomService = {
    /**
     * Lấy tất cả phòng
     * @returns Danh sách phòng
     */
    getAll: async () => {
        try {
            const response = await publicApi.get<RoomsResponse>(API_CONFIG.endpoints.room.getAll);

            if (response.data?.success) {
                return response.data.rooms;
            }

            return [];
        } catch (error) {
            console.error('Failed to fetch rooms!', error);
            throw new Error('Failed to fetch rooms!');
        }
    },

    /**
     * Lấy thông tin phòng theo ID
     * @param id ID của phòng
     * @returns Thông tin phòng
     */
    getById: async (id: number) => {
        try {
            const response = await publicApi.get<RoomResponse>(API_CONFIG.endpoints.room.getById(id));

            if (response.data?.success) {
                return response.data.room;
            }

            return null;
        } catch (error) {
            console.error(`Failed to fetch room with id: ${id}!`, error);
            throw new Error(`Failed to fetch room with id: ${id}!`);
        }
    },

    /**
     * Lấy thông tin phòng theo mã PIN
     * @param pin Mã PIN của phòng
     * @returns Thông tin phòng
     */
    getByPin: async (pin: string) => {
        try {
            const response = await publicApi.get<RoomResponse>(API_CONFIG.endpoints.room.getByPin(pin));

            if (response.data?.success) {
                return response.data.room;
            }

            return null;
        } catch (error) {
            console.error(`Failed to fetch room with pin: ${pin}!`, error);
            throw new Error(`Failed to fetch room with pin: ${pin}!`);
        }
    },

    /**
     * Tạo mới phòng
     * @param data Dữ liệu phòng mới
     * @returns ID của phòng mới và mã PIN
     */
    create: async (data: Partial<Room>): Promise<{ room_id: number; pin: string }> => {
        try {
            const response = await privateApi.post<RoomResponse>(API_CONFIG.endpoints.room.create, data);
            if (response.data?.success) {
                return {
                    room_id: response.data.room_id,
                    pin: response.data.pin
                };
            }
            throw new Error(response.data.message || 'Failed to create room!');
        } catch (error) {
            console.error('Failed to create room:', error);
            throw new Error('Failed to create room!');
        }
    },
    /**
     * Cập nhật thông tin phòng
     * @param id ID của phòng
     * @param data Dữ liệu cập nhật
     * @returns Thông báo
     */
    update: async (id: number, data: Partial<Room>) => {
        try {
            const response = await privateApi.put<RoomResponse>(API_CONFIG.endpoints.room.update(id), data);
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || `Failed to update room with id: ${id}!`);
        } catch (error) {
            console.error(`Failed to update room with id: ${id}!`, error);
            throw new Error(`Failed to update room with id: ${id}!`);
        }
    },
    /**
     * Xoá phòng theo ID
     * @param id ID của phòng
     * @returns Thông báo
     */
    delete: async (id: number) => {
        try {
            const response = await privateApi.delete<RoomResponse>(API_CONFIG.endpoints.room.delete(id));
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || `Failed to delete room with id: ${id}!`);
        } catch (error) {
            console.error(`Failed to delete room with id: ${id}!`, error);
            throw new Error(`Failed to delete room with id: ${id}!`);
        }
    }
};