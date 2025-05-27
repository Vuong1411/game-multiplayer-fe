import { api } from './api';
import { Player } from '@project/types/room';
import { API_CONFIG } from '@project/config/api.config';

interface PlayersResponse {
    success: boolean;
    players: Player[];
}

interface PlayerResponse {
    success: boolean;
    player: Player;
}

export const playerService = {
    /**
     * Lấy tất cả người chơi trong phòng
     * @param room_id ID của phòng
     * @returns Danh sách người chơi
     */
    getAll: async (room_id: number) => {
        try {
            const response = await api.get<PlayersResponse>(API_CONFIG.endpoints.player.getAll(room_id));

            if (response.data?.success) {
                return response.data.players;
            }

            return [];
        } catch (error) {
            console.error('Error fetching players:', error);
            throw new Error('Failed to fetch players!');
        }
    },

    /**
     * Lấy thông tin người chơi theo ID
     * @param id ID của người chơi
     * @returns Thông tin người chơi
     */
    getById: async (id: number) => {
        try {
            const response = await api.get<PlayerResponse>(API_CONFIG.endpoints.player.getById(id));

            if (response.data?.success) {
                return response.data.player;
            }

            return null;
        } catch (error) {
            console.error('Error fetching player by ID:', error);
            throw new Error(`Failed to fetch player with id: ${id}!`);
        }
    },
    /**
     * Tạo mới người chơi
     * @param data Dữ liệu người chơi
     * @returns ID của người chơi mới tạo
     */
    create: async (data: Partial<Player>) => {
        try {
            const response = await api.post<PlayerResponse>(API_CONFIG.endpoints.player.create, data);
            if (response.data?.success) {
                return response.data.player.id;
            }
            return null;
        } catch (error) {
            console.error('Error creating player:', error);
            throw new Error('Failed to create player!');
        }
    },
    /**
     * Cập nhật thông tin người chơi
     * @param id ID của người chơi
     * @param data Dữ liệu cập nhật
     * @returns Thông tin người chơi đã cập nhật
     */
    update: async (id: number, data: Partial<Player>) => {
        try {
            const response = await api.put<PlayerResponse>(API_CONFIG.endpoints.player.update(id), data);
            if (response.data?.success) {
                return response.data.player;
            }
        } catch (error) {
            console.error('Error updating player:', error);
            throw new Error(`Failed to update player with id: ${id}!`);
        }
    },
    /**
     * Xóa người chơi
     * @param id ID của người chơi
     * @returns Trả về true nếu xóa thành công, false nếu không thành công
     */
    delete: async (id: number) => {
        try {
            const response = await api.delete(API_CONFIG.endpoints.player.delete(id));
            return response.data?.success || false;
        } catch (error) {
            console.error('Error deleting player:', error);
            throw new Error(`Failed to delete player with id: ${id}!`);
        }
    }
}