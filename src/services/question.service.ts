import { api } from './api';
import { Question } from '@project/types/question';
import { API_CONFIG } from '@project/config/api.config';
import { getImageUrl } from '@project/utils/Image';

interface QuestionsResponse {
    success: boolean;
    questions: Question[];
}

interface QuestionResponse {
    success: boolean;
    question: Question;
    message: string;
}

export const questionService = {
    /**
     * Lấy tất cả câu hỏi
     * @param question_set_id ID của bộ câu hỏi
     * @returns Danh sách câu hỏi
     */
    getAll: async (question_set_id: number) => {
        try {
            const response = await api.get<QuestionsResponse>(API_CONFIG.endpoints.question.getAll(question_set_id));

            if (response.data?.success) {
                response.data.questions.forEach(item => {
                    item.image_url = getImageUrl(item.image_url);
                });
                return response.data.questions;
            }

            return [];
        } catch (error) {
            throw new Error('Failed to fetch questions!');
        }
    },

    /**
     * Lấy câu hỏi theo ID
     * @param id ID của câu hỏi
     * @returns Câu hỏi tương ứng với ID
     */
    getById: async (id: number) => {
        try {
            const response = await api.get<QuestionResponse>(API_CONFIG.endpoints.question.getById(id));

            if (response.data?.success) {
                response.data.question.image_url = getImageUrl(response.data.question.image_url);
                return response.data.question;
            }

            return null;
        } catch (error) {
            throw new Error(`Failed to fetch question with id: ${id}!`);
        }
    },
    /**
     * Tạo mới câu hỏi
     * @param data Dữ liệu câu hỏi
     * @returns Câu hỏi vừa tạo
     */
    create: async (data: Partial<Question>, image?: File): Promise<number | null> => {
        try {
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                const value = data[key as keyof Question];
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
            if (image) {
                formData.append('image', image);
            }
            
            const response = await api.post<QuestionResponse>(API_CONFIG.endpoints.question.create,formData);
            if (response.data?.success) {
                response.data.question.image_url = getImageUrl(response.data.question.image_url);
                return response.data.question.id;
            }
            return null;
        } catch (error) {
            throw new Error('Failed to create question!');
        }
    },
    /**
     * Cập nhật câu hỏi
     * @param id ID của câu hỏi
     * @param data Dữ liệu cập nhật
     * @returns Câu hỏi đã cập nhật
     */
    update: async (id: number, data: Partial<Question>, image?: File): Promise<string | null> => {
        try {
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                const value = data[key as keyof Question];
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            if (image) {
                formData.append('image', image);
            }

            const response = await api.put<QuestionResponse>(API_CONFIG.endpoints.question.update(id), formData);
            if (response.data?.success) {
                return response.data.message;
            }
            
            return null;
        } catch (error) {
            console.error('Error updating question:', error);
            throw new Error(`Failed to update question with id: ${id}!`);
        }
    },
}

