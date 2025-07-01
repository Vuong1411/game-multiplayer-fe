import { publicApi, privateApi } from './api';
import { QuestionSet } from '@project/types/question';
import { API_CONFIG } from '@project/config/api.config';
import { getImageUrl } from '@project/utils/Image';
import { uploadToCloudinary } from '@project/utils/Cloudinary';

interface QuestionSetsResponse {
    success: boolean;
    question_sets: QuestionSet[];
}

interface QuestionSetResponse {
    success: boolean;
    question_set: QuestionSet;
    question_set_id: number;
    message: string;
}

export const questionSetService = {
    /**
     * Lấy tất cả bộ câu hỏi
     * @returns Danh sách bộ câu hỏi
     */
    getAll: async () => {
        try {
            const response = await publicApi.get<QuestionSetsResponse>(API_CONFIG.endpoints.questionSet.getAll);

            if (response.data?.success) {
                response.data.question_sets.forEach(item => {
                    item.image_url = getImageUrl(item.image_url);
                })
                return response.data.question_sets;
            }

            return [];
        } catch (error) {
            console.error('Failed to fetch question sets:', error);
            throw new Error('Failed to fetch question sets!');
        }
    },

    /**
     * Lấy bộ câu hỏi theo ID
     * @param id ID của bộ câu hỏi
     * @returns Thông tin bộ câu hỏi
     */
    getById: async (id: number) => {
        try {
            const response = await publicApi.get<QuestionSetResponse>(API_CONFIG.endpoints.questionSet.getById(id));

            if (response.data?.success) {
                response.data.question_set.image_url = getImageUrl(response.data.question_set.image_url);
                return response.data.question_set;
            }
            return null;
        } catch (error) {
            console.error(`Failed to fetch question set with id: ${id}`, error);
            throw new Error(`Failed to fetch question set with id: ${id}!`);
        }
    },

    /**
     * Lấy bộ câu hỏi theo ID người dùng
     * @param userId ID của người dùng
     * @returns Danh sách bộ câu hỏi của người dùng
     */
    getByUserId: async (userId: number) => {
        try {
            const response = await publicApi.get<QuestionSetsResponse>(API_CONFIG.endpoints.questionSet.getByUserId(userId));

            if (response.data?.success) {
                response.data.question_sets.forEach(item => {
                    item.image_url = getImageUrl(item.image_url);
                })
                return response.data.question_sets;
            }

            return [];
        } catch (error) {
            console.error(`Failed to fetch question sets for user with id: ${userId}`, error);
            throw new Error(`Failed to fetch question set with id: ${userId}!`);
        }
    },

    /**
     * Lấy bộ câu hỏi của người dùng hiện tại
     * @returns Danh sách bộ câu hỏi của người dùng hiện tại
     */
    getMe: async () => {
        try {
            const response = await privateApi.get<QuestionSetsResponse>(API_CONFIG.endpoints.questionSet.getMe);

            if (response.data?.success) {
                response.data.question_sets.forEach(item => {
                    item.image_url = getImageUrl(item.image_url);
                })
                return response.data.question_sets;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch my question sets:', error);
            throw new Error('Failed to fetch my question sets!');
        }
    },

    search: async (query: string) => {
        try {
            const response = await privateApi.get<QuestionSetsResponse>(API_CONFIG.endpoints.questionSet.search(query));
            if (response.data?.success) {
                response.data.question_sets.forEach(item => {
                    item.image_url = getImageUrl(item.image_url);
                });
                return response.data.question_sets;
            }
            return [];
        } catch (error) {
            console.error('Failed to search question sets:', error);
            throw new Error('Failed to search question sets!');
        }
    },

    /**
     * Tạo mới bộ câu hỏi
     * @param data Dữ liệu bộ câu hỏi mới
     * @param image Ảnh đại diện của bộ câu hỏi (nếu có)
     * @returns ID của bộ câu hỏi mới tạo
     */
    create: async (data: Partial<QuestionSet>, image?: File) => {
        try {
            // Nếu có ảnh, upload lên Cloudinary trước
            if (image) {
                const imageUrl = await uploadToCloudinary(image, 'question-sets');
                if (imageUrl) {
                    data.image_url = imageUrl;
                } else {
                    throw new Error('Failed to upload image!');
                }
            }

            const response = await privateApi.post<QuestionSetResponse>(API_CONFIG.endpoints.questionSet.create, data);
            if (response.data?.success) {
                return response.data.question_set_id;
            }

            throw new Error(response.data.message || 'Failed to create question set!');
        } catch (error) {
            console.error('Error creating question set:', error);
            throw new Error('Failed to create question set!');
        }
    },

    /**
     * Cập nhật bộ câu hỏi
     * @param id ID của bộ câu hỏi cần cập nhật
     * @param data Dữ liệu cập nhật
     * @param image Ảnh đại diện mới (nếu có)
     * @returns Thông báo
     */
    update: async (id: number, data: Partial<QuestionSet>, image?: File) => {
        try {
            // Nếu có ảnh, upload lên Cloudinary trước
            if (image) {
                const imageUrl = await uploadToCloudinary(image, 'question-sets');
                if (imageUrl) {
                    data.image_url = imageUrl;
                } else {
                    throw new Error('Failed to upload image!');
                }
            }

            const response = await privateApi.put<QuestionSetResponse>(API_CONFIG.endpoints.questionSet.update(id), data);
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || `Failed to update question set with id: ${id}!`);
        } catch (error) {
            console.error('Error updating question set:', error);
            throw new Error(`Failed to update question set with id: ${id}!`);
        }
    },

    /**
     * Xoá bộ câu hỏi theo ID
     * @param id ID của bộ câu hỏi cần xoá
     * @return Thông báo
     */
    delete: async (id: number) => {
        try {
            const response = await privateApi.delete(API_CONFIG.endpoints.questionSet.delete(id));
            if (response.data?.success) {
                return response.data.message;
            }
            throw new Error(response.data.message || `Failed to delete question set with id: ${id}!`);
        } catch (error) {
            console.error(`Failed to delete question set with id: ${id}`, error);
            throw new Error(`Failed to delete question set with id: ${id}!`);
        }
    },
    /**
     * Lấy thống kê bộ câu hỏi
     * @param id ID của bộ câu hỏi
     * @returns Thống kê bộ câu hỏi
     */
    getStats: async (id: number) => {
        try {
            const response = await publicApi.get<{ success: boolean; stats: { total_rooms: number; total_players: number } }>(API_CONFIG.endpoints.questionSet.getStats(id));
            if (response.data?.success && response.data.stats) {
                return response.data.stats;
            }
            throw new Error(`Failed to fetch stats for question set with id: ${id}!`);
        } catch (error) {
            console.error(`Failed to fetch stats for question set with id: ${id}`, error);
            throw new Error(`Failed to fetch stats for question set with id: ${id}!`);
        }
    }

};