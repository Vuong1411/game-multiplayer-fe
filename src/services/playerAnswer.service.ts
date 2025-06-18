import { publicApi, privateApi } from './api';
import { API_CONFIG } from '../config/api.config';
import { PlayerAnswer } from '@project/types';

interface PlayerAnswersResponse {
    success: boolean;
    playerAnswers: PlayerAnswer[];
    message: string;
}

interface PlayerAnswerResponse {
    success: boolean;
    playerAnswer: PlayerAnswer;
    message: string;
    points?: number;
}

export const playerAnswerService ={
    /**
     * Lấy tất cả câu trả lời theo ID người chơi
     * @param player_id ID của người chơi
     * @returns Danh sách câu trả lời của người chơi
     */
    getByPlayer: async (player_id: number) => {
        try {
            const response = await publicApi.get<PlayerAnswersResponse>(API_CONFIG.endpoints.playerAnswer.getByPlayer(player_id));
            if (response.data?.success) {
                return response.data.playerAnswers;
            }
            return [];
        } catch (error) {
            console.error('Error fetching player answers:', error);
            throw new Error('Failed to fetch player answers!');
        }
    },
    /**
     * Lấy tất cả câu trả lời theo ID phòng
     * @param room_id ID của phòng
     * @returns Danh sách câu trả lời của người chơi
     */
    getByRoom: async (room_id: number) => {
        try {
            const response = await publicApi.get<PlayerAnswersResponse>(API_CONFIG.endpoints.playerAnswer.getByRoom(room_id));
            if (response.data?.success) {
                return response.data.playerAnswers;
            }
            return [];
        } catch (error) {
            console.error('Error fetching player answers by room:', error);
            throw new Error('Failed to fetch player answers by room!');
        }
    },
    /**
     * Lấy tất cả câu trả lời theo ID câu hỏi
     * @param question_id ID của câu hỏi
     * @returns Danh sách câu trả lời của người chơi
     */
    getByQuestion: async (question_id: number) => {
        try {
            const response = await publicApi.get<PlayerAnswersResponse>(API_CONFIG.endpoints.playerAnswer.getByQuestion(question_id));
            if (response.data?.success) {
                return response.data.playerAnswers;
            }
            return [];
        } catch (error) {
            console.error('Error fetching player answers by question:', error);
            throw new Error('Failed to fetch player answers by question!');
        }
    },
    /**
     * Lấy câu trả lời theo ID
     * @param id ID của câu trả lời
     * @returns Danh sách câu trả lời của người chơi
     */
    getById: async (id: number) => {
        try {
            const response = await publicApi.get<PlayerAnswerResponse>(API_CONFIG.endpoints.playerAnswer.getById(id));
            if (response.data?.success) {
                return response.data.playerAnswer;
            }
            return null;
        } catch (error) {
            console.error('Error fetching player answer by ID:', error);
            throw new Error(`Failed to fetch player answer with id: ${id}!`);
        }
    },
    /**
     * Nộp câu trả lời của người chơi
     * @param data Dữ liệu câu trả lời
     * @returns Điểm của câu trả lời mới tạo
     */
    create: async (data: Partial<PlayerAnswer>) => {
        try {
            const response = await privateApi.post<PlayerAnswerResponse>(API_CONFIG.endpoints.playerAnswer.create, data);
            if (response.data?.success) {
                return response.data.points;
            }
            throw new Error(response.data.message || 'Failed to create player answer!');
        } catch (error) {
            console.error('Error creating player answer:', error);
            throw new Error('Failed to create player answer!');
        }
    },
}