import { publicApi, privateApi } from './api';
import { Player } from '@project/types/room';
import { API_CONFIG } from '@project/config/api.config';

interface PlayersResponse {
    success: boolean;
    players: Player[];
    message: string;
}

interface PlayerResponse {
    success: boolean;
    player: Player;
    player_id: number;
    message: string;
}

export const playerService = {

    /**
     * Lấy tất cả người chơi trong phòng
     * @param room_id ID của phòng
     * @returns Danh sách người chơi
     */
    getAll: async (room_id: number) => {
        try {
            const response = await publicApi.get<PlayersResponse>(API_CONFIG.endpoints.player.getAll(room_id));

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
     * Lấy danh sách người chơi theo PIN
     * @param pin PIN của phòng
     * @returns Danh sách người chơi
     */
    getByPin: async (pin: string) => {
        try {
            const response = await publicApi.get<PlayersResponse>(API_CONFIG.endpoints.player.getByPin(pin));

            if (response.data?.success) {
                return response.data.players;
            }

            return [];
        } catch (error) {
            console.error('Error fetching player by PIN:', error);
            throw new Error(`Failed to fetch player with pin: ${pin}!`);
        }
    },

    /**
     * Lấy thông tin người chơi theo ID
     * @param id ID của người chơi
     * @returns Thông tin người chơi
     */
    getById: async (id: number) => {
        try {
            const response = await publicApi.get<PlayerResponse>(API_CONFIG.endpoints.player.getById(id));

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
    create: async (pin: string, nickname: string) => {
        try {
            const response = await privateApi.post<PlayerResponse>(API_CONFIG.endpoints.player.create, {pin, nickname});
            if (response.data?.success) {
                return response.data.player_id;
            }
            throw new Error(response.data.message || 'Failed to create player!');
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
            const response = await privateApi.put<PlayerResponse>(API_CONFIG.endpoints.player.update(id), data);
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || 'Failed to update player!');
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
            const response = await privateApi.delete(API_CONFIG.endpoints.player.delete(id));
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || `Failed to delete player with id: ${id}!`);
        } catch (error) {
            console.error('Error deleting player:', error);
            throw new Error(`Failed to delete player with id: ${id}!`);
        }
    }
}