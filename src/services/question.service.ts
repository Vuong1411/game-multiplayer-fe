import { publicApi, privateApi } from './api';
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
    question_id: number;
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
            const response = await publicApi.get<QuestionsResponse>(API_CONFIG.endpoints.question.getAll(question_set_id));

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
     * @returns Thông tin câu hỏi
     */
    getById: async (id: number) => {
        try {
            const response = await publicApi.get<QuestionResponse>(API_CONFIG.endpoints.question.getById(id));

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
     * @returns ID của câu hỏi mới được tạo
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
            
            const response = await privateApi.post<QuestionResponse>(API_CONFIG.endpoints.question.create,formData);
            if (response.data?.success) {
                return response.data.question_id;
            }
            
            throw new Error(response.data.message || 'Failed to create question!');
        } catch (error) {
            console.error('Error creating question:', error);
            throw new Error('Failed to create question!');
        }
    },
    /**
     * Cập nhật câu hỏi
     * @param id ID của câu hỏi
     * @param data Dữ liệu cập nhật
     * @returns Thông báo thành công
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

            const response = await privateApi.put<QuestionResponse>(API_CONFIG.endpoints.question.update(id), formData);
            if (response.data?.success) {
                return response.data.message;
            }

            throw new Error(response.data.message || 'Failed to update question!');
        } catch (error) {
            console.error('Error updating question:', error);
            throw new Error(`Failed to update question with id: ${id}!`);
        }
    },
    /**
     * Xoá câu hỏi
     * @param id ID của câu hỏi
     * @returns Thông báo thành công hoặc null nếu không thành công
     */
    delete: async (id: number): Promise<string | null> => {
        try {
            const response = await privateApi.delete<QuestionResponse>(API_CONFIG.endpoints.question.delete(id));
            if (response.data?.success) {
                return response.data.message;
            }

            throw new Error(response.data.message || 'Failed to delete question!');
        } catch (error) {
            console.error('Error deleting question:', error);
            throw new Error(`Failed to delete question with id: ${id}!`);
        }
    }
}

