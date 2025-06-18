import { publicApi, privateApi } from './api';
import { Answer } from '@project/types/question';
import { API_CONFIG } from '@project/config/api.config';

interface AnswersResponse {
    success: boolean;
    answers: Answer[];
}

interface AnswerResponse {
    success: boolean;
    answer: Answer;
    answer_id: number;
    message: string;
}

export const answerService = {
    
    /**
     * Lấy tất cả câu trả lời theo ID câu hỏi
     * @param question_id ID của câu hỏi
     * @returns Danh sách câu trả lời
     */
    getAll: async (question_id: number) => {
        try {
            const response = await publicApi.get<AnswersResponse>(API_CONFIG.endpoints.answer.getAll(question_id));

            if (response.data?.success) {
                return response.data.answers;
            }

            return [];
        } catch (error) {
            console.error(`Failed to fetch answers for question id: ${question_id}!`);
            return [];
        }
    },

    /**
     * Tạo mới câu trả lời
     * @param data Dữ liệu câu trả lời
     * @returns Câu trả lời vừa tạo
     */
    create: async (data: Partial<Answer>) => {
        try {
            const response = await privateApi.post<AnswerResponse>(API_CONFIG.endpoints.answer.create, data);
            if (response.data?.success) {
                return response.data.answer_id;
            }
            throw new Error(response.data.message || 'Failed to create answer!');
        } catch (error) {
            console.error('Failed to create answer!', error);
            throw new Error('Failed to create answer!');
        }
    },

    /**
     * Cập nhật câu trả lời
     * @param id ID của câu trả lời
     * @param data Dữ liệu cập nhật
     * @returns Câu trả lời đã cập nhật
     */
    update: async (id: number, data: Partial<Answer>) => {
        try {
            const response = await privateApi.put<AnswerResponse>(API_CONFIG.endpoints.answer.update(id), data);
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || 'Failed to update answer!');
        } catch (error) {
            throw new Error(`Failed to update answer with id: ${id}!`);
        }
    },

    /**
     * Xoá câu trả lời
     * @param id ID của câu trả lời
     * @returns Thông báo thành công hay thất bại
     */
    delete: async (id: number) => {
        try {
            const response = await privateApi.delete<AnswerResponse>(API_CONFIG.endpoints.answer.delete(id));
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || 'Failed to delete answer!');
        } catch (error) {
            throw new Error(`Failed to delete answer with id: ${id}!`);
        }
    }
};