import { api } from './api';
import { Room } from '@project/types/room';
import { API_CONFIG } from '@project/config/api.config';

interface RoomsResponse {
    success: boolean;
    rooms: Room[];
}

interface RoomResponse {
    success: boolean;
    room: Room;
}

export const roomService = {
    /**
     * Lấy tất cả phòng
     * @returns Danh sách phòng
     */
    getAll: async () => {
        try {
            const response = await api.get<RoomsResponse>(API_CONFIG.endpoints.room.getAll);

            if (response.data?.success) {
                return response.data.rooms;
            }

            return [];
        } catch (error) {
            throw new Error('Failed to fetch rooms!');
        }
    },

    // Lấy phòng theo ID
    getById: async (id: number) => {
        try {
            const response = await api.get<RoomResponse>(API_CONFIG.endpoints.room.getById(id));

            if (response.data?.success) {
                return response.data.room;
            }

            return null;
        } catch (error) {
            throw new Error(`Failed to fetch room with id: ${id}!`);
        }
    },

    // Tạo mới phòng
    create: async (data: Partial<Room>) => {
        try {
            const response = await api.post<Room>(API_CONFIG.endpoints.room.create, data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create room!');
        }
    },
};