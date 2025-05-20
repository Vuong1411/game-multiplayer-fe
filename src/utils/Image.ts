import { API_CONFIG } from '../config/api.config';

/**
 * Hàm lấy URL đầy đủ của ảnh
 * @param path URL tương đối của ảnh
 * @returns URL chính xác của ảnh
 */
export const getImageUrl = (path?: string): string => {
    if (!path) {
        return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${API_CONFIG.baseURL}${path}`;
};