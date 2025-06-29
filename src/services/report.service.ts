import { publicApi, privateApi } from './api';
import { RoomReport, RoomReportDetails, PlayerReport } from '@project/types';
import { API_CONFIG } from '@project/config/api.config';

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

export const reportService = {
    /**
     * Lấy danh sách báo cáo phòng
     * @param type Loại báo cáo (all, solo, live)
     * @returns Danh sách báo cáo phòng
     */
    getAll: async (type: string) => {
        try {
            const response = await privateApi.get<RoomReportsResponse>(API_CONFIG.endpoints.report.getAll(type));
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
     * Lấy chi tiết báo cáo phòng
     * @param room_id ID của phòng
     * @returns Chi tiết báo cáo phòng
     */
    getRoomReport: async (room_id: number) => {
        try {
            const response = await privateApi.get<RoomReportResponse>(API_CONFIG.endpoints.room.report(room_id));
            if (response.data?.success) {
                return response.data.report;
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch room report detail!', error);
            throw new Error('Failed to fetch room report detail!');
        }
    },

    /**
     * Lấy báo cáo của người chơi trong phòng
     * @param room_id ID của phòng
     * @returns Danh sách báo cáo của người chơi
     */
    getPlayerReports: async (room_id: number) => {
        try {
            const response = await privateApi.get<PlayerReportResponse>(API_CONFIG.endpoints.report.getPlayerReports(room_id));
            if (response.data?.success) {
                return response.data.reports;
            }
            throw new Error(response.data.message || 'Failed to fetch player report!');
        } catch (error) {
            console.error('Failed to fetch player report detail!', error);
            throw new Error('Failed to fetch player report detail!');
        }
    }
}