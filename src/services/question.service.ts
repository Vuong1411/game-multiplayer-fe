import { api } from './index';
import { Question } from '../types/question';
import { API_CONFIG } from '../config/api.config';
import { getImageUrl } from '../utils/Image';

interface QuestionsResponse {
    success: boolean;
    questions: Question[];
}

interface QuestionResponse {
    success: boolean;
    question: Question;
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
            throw new Error('Failed to fetch questions');
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
            throw new Error(`Failed to fetch question with id: ${id}`);
        }
    },
}