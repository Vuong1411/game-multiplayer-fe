import { api } from './api';
import { QuestionSet } from '@project/types/question';
import { API_CONFIG } from '@project/config/api.config';
import { getImageUrl } from '@project/utils/Image';

interface QuestionSetsResponse {
    success: boolean;
    question_sets: QuestionSet[];
}

interface QuestionSetResponse {
    success: boolean;
    question_set: QuestionSet;
}

export const questionSetService = {
    /**
     * Lấy tất cả bộ câu hỏi
     * @returns Bộ câu hỏi
     */
    getAll: async () => {
        try {
            const response = await api.get<QuestionSetsResponse>(API_CONFIG.endpoints.questionSet.getAll);

            if (response.data?.success) {
                response.data.question_sets.forEach(item => {
                    item.image_url = getImageUrl(item.image_url);
                })
                return response.data.question_sets;
            }

            return [];
        } catch (error) {
            throw new Error('Failed to fetch question sets!');
        }
    },

    // Lấy bộ câu hỏi theo ID
    getById: async (id: number) => {
        try {
            const response = await api.get<QuestionSetResponse>(API_CONFIG.endpoints.questionSet.getById(id));

            if (response.data?.success) {
                response.data.question_set.image_url = getImageUrl(response.data.question_set.image_url);
                return response.data.question_set;
            }

            return null;
        } catch (error) {
            throw new Error(`Failed to fetch question set with id: ${id}!`);
        }
    },

    // Tạo mới bộ câu hỏi
    create: async (data: Partial<QuestionSet>) => {
        try {
            const response = await api.post<QuestionSet>(API_CONFIG.endpoints.questionSet.create, data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create question set!');
        }
    },

    // Cập nhật bộ câu hỏi
    update: async (id: number, data: Partial<QuestionSet>) => {
        try {
            const response = await api.put<QuestionSet>(API_CONFIG.endpoints.questionSet.update(id), data);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update question set with id: ${id}!`);
        }
    },

    // Xóa bộ câu hỏi
    delete: async (id: number) => {
        try {
            await api.delete(API_CONFIG.endpoints.questionSet.delete(id));
        } catch (error) {
            throw new Error(`Failed to delete question set with id: ${id}!`);
        }
    },

};