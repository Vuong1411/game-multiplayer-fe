import { publicApi, privateApi } from './api';
import { Room, RoomReport, RoomReportDetails, PlayerReport, QuestionReport, PlayerAnswerReport } from '@project/types';
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

interface RoomReportsResponse {
    success: boolean;
    reports: RoomReport[];
    message: string;
}

interface RoomReportResponse {
    success: boolean;
    report: RoomReportDetails;
    message: string;
}

interface PlayerReportResponse {
    success: boolean;
    reports: PlayerReport[];
    message: string;
}

interface QuestionReportResponse {
    success: boolean;
    reports: QuestionReport[];
    message: string;
}

interface PlayerAnswerReportResponse {
    success: boolean;
    reports: PlayerAnswerReport[];
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
     * Lấy danh sách phòng sử dụng bộ câu hỏi
     * @param question_set_id ID của bộ câu hỏi
     * @returns Danh sách phòng sử dụng bộ câu hỏi
     */
    getByQuestionSetId: async (question_set_id: number) => {
        try {
            const response = await publicApi.get<RoomsResponse>(`${API_CONFIG.endpoints.room.getBySetId(question_set_id)}`);
            if (response.data?.success) {
                return response.data.rooms;
            }
            return [];
        } catch (error) {
            console.error(`Failed to fetch rooms for question set id: ${question_set_id}!`, error);
            throw new Error(`Failed to fetch rooms for question set id: ${question_set_id}!`);
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
    },
    /**
     * Xoá nhiều phòng/báo cáo theo danh sách ID
     * @param ids Mảng ID của phòng/báo cáo
     * @returns Thông báo thành công hoặc lỗi
     */
    deleteMany: async (ids: number[]) => {
        try {
            const response = await privateApi.post<RoomsResponse>(API_CONFIG.endpoints.room.deleteMany, { ids });
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || 'Failed to delete multiple rooms/reports!');
        } catch (error) {
            console.error('Failed to delete multiple rooms/reports!', error);
            throw new Error('Failed to delete multiple rooms/reports!');
        }
    },
    /**
     * Lấy danh sách báo cáo của phòng
     * @param type Loại báo cáo ('sync', 'async')
     * @returns Danh sách báo cáo
     */
    reports: async (type: string) => {
        try {
            const response = await privateApi.get<RoomReportsResponse>(API_CONFIG.endpoints.room.reports(type));
            if (response.data?.success) {
                return response.data.reports;
            }
            throw new Error(response.data.message || 'Failed to fetch room reports!');
        } catch (error) {
            console.error('Failed to fetch room reports!', error);
            throw new Error('Failed to fetch room reports!');
        }
    },
    /**
     * Lấy chi tiết báo cáo của phòng
     * @param id ID của báo cáo
     * @returns Chi tiết báo cáo
     */
    report: async (id: number) => {
        try {
            const response = await privateApi.get<RoomReportResponse>(API_CONFIG.endpoints.room.report(id));
            if (response.data?.success) {
                return response.data.report;
            }
            throw new Error(response.data.message || `Failed to fetch report with id: ${id}!`);
        } catch (error) {
            console.error(`Failed to fetch report with id: ${id}!`, error);
            throw new Error(`Failed to fetch report with id: ${id}!`);
        }
    },
    /**
     * Lấy danh sách báo cáo của người chơi trong phòng
     * @param room_id ID của phòng
     * @returns Danh sách báo cáo người chơi
     */
    getPlayerReports: async (room_id: number) => {
        try {
            const response = await privateApi.get<PlayerReportResponse>(API_CONFIG.endpoints.room.getPlayerReports(room_id));
            if (response.data?.success) {
                return response.data.reports;
            }
            throw new Error(response.data.message || `Failed to fetch player reports for room id: ${room_id}!`);
        } catch (error) {
            console.error(`Failed to fetch player reports for room id: ${room_id}!`, error);
            throw new Error(`Failed to fetch player reports for room id: ${room_id}!`);
        }
    },
    /**
     * Lấy chi tiết báo cáo của người chơi
     * @param player_id ID của người chơi
     * @returns Danh sách báo cáo chi tiết của người chơi
     */
    getPlayerAnswerReports: async (player_id: number) => {
        try {
            const response = await privateApi.get<PlayerAnswerReportResponse>(API_CONFIG.endpoints.room.getPlayerAnswerReports(player_id));
            console.log('Player Answer Reports Response:', response.data);
            if (response.data?.success) {
                return response.data.reports;
            }
            throw new Error(response.data.message || `Failed to fetch player report details for player id: ${player_id}!`);
        } catch (error) {
            console.error(`Failed to fetch player report details for player id: ${player_id}!`, error);
            throw new Error(`Failed to fetch player report details for player id: ${player_id}!`);
        }
    },
    /**
     * Lấy danh sách báo cáo câu hỏi trong phòng
     * @param room_id ID của phòng
     * @returns Danh sách báo cáo câu hỏi
     */
    getQuestionReports: async (room_id: number) => {
        try {
            const response = await privateApi.get<QuestionReportResponse>(API_CONFIG.endpoints.room.getQuestionReports(room_id));
            if (response.data?.success) {
                return response.data.reports;
            }
            throw new Error(response.data.message || `Failed to fetch question reports for room id: ${room_id}!`);
        } catch (error) {
            console.error(`Failed to fetch question reports for room id: ${room_id}!`, error);
            throw new Error(`Failed to fetch question reports for room id: ${room_id}!`);
        }
    },

};