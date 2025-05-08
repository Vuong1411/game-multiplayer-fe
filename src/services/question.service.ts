import { api } from './index';
import { QuestionSet, Question } from '../types/question';
import { API_CONFIG } from '../config/api.config';

export const questionSetService = {
    // Lấy tất cả bộ câu hỏi
    getAll: async () => {
        try {
            const response = await api.get<QuestionSet[]>(API_CONFIG.endpoints.questionSet.getAll);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch question sets');
        }
    },

    // Lấy bộ câu hỏi theo ID
    getById: async (id: string) => {
        try {
            const response = await api.get<QuestionSet>(API_CONFIG.endpoints.questionSet.getById(id));
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch question set with id: ${id}`);
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
    update: async (id: string, data: Partial<QuestionSet>) => {
        try {
            const response = await api.put<QuestionSet>(API_CONFIG.endpoints.questionSet.update(id), data);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update question set with id: ${id}`);
        }
    },

    // Xóa bộ câu hỏi
    delete: async (id: string) => {
        try {
            await api.delete(API_CONFIG.endpoints.questionSet.delete(id));
        } catch (error) {
            throw new Error(`Failed to delete question set with id: ${id}`);
        }
    },
    
};

export const questionService = {
    // Lấy tất cả câu hỏi trong bộ câu hỏi
    getAll: async (setId: string) => {
        try {
            const response = await api.get<Question[]>(API_CONFIG.endpoints.question.getAll(setId));
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch questions for set with id: ${setId}`);
        }
    },

    // Lấy câu hỏi theo ID
    getById: async (setId: string, id: string) => {
        try {
            const response = await api.get<Question>(API_CONFIG.endpoints.question.getById(setId, id));
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch question with id: ${id} in set: ${setId}`);
        }
    },

    // Tạo mới câu hỏi
    create: async (setId: string, data: Partial<Question>) => {
        try {
            const response = await api.post<Question>(API_CONFIG.endpoints.question.create(setId), data);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create question in set with id: ${setId}`);
        }
    },

    // Cập nhật câu hỏi
    update: async (setId: string, id: string, data: Partial<Question>) => {
        try {
            const response = await api.put<Question>(API_CONFIG.endpoints.question.update(setId, id), data);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update question with id: ${id} in set: ${setId}`);
        }
    },

    // Xóa câu hỏi
    delete: async (setId: string, id: string) => {
        try {
            await api.delete(API_CONFIG.endpoints.question.delete(setId, id));
        } catch (error) {
            throw new Error(`Failed to delete question with id: ${id} in set: ${setId}`);
        }
    },

};

