import { api } from './api';
import { Answer } from '@project/types/question';
import { API_CONFIG } from '@project/config/api.config';

interface AnswersResponse {
    success: boolean;
    answers: Answer[];
}

interface AnswerResponse {
    success: boolean;
    answer: Answer;
}

export const answerService = {
    /**
     * Lấy tất cả câu trả lời theo ID câu hỏi
     * @param question_id ID của câu hỏi
     * @returns Danh sách câu trả lời
     */
    getAll: async (question_id: number) => {
        try {
            const response = await api.get<AnswersResponse>(API_CONFIG.endpoints.answer.getAll(question_id));

            if (response.data?.success) {
                return response.data.answers;
            }

            return [];
        } catch (error) {
            throw new Error('Failed to fetch answers!');
        }
    },
    /**
     * Tạo mới câu trả lời
     * @param data Dữ liệu câu trả lời
     * @returns Câu trả lời vừa tạo
     */
    create: async (data: Partial<Answer>): Promise<Answer | null> => {
        try {
            const response = await api.post<AnswerResponse>(API_CONFIG.endpoints.answer.create, data);
            if (response.data?.success) {
                return response.data.answer;
            }
            return null;
        } catch (error) {
            throw new Error('Failed to create answer!');
        }
    },
};