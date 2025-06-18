import { API_CONFIG } from '@project/config/api.config';

/**
 * Hàm lấy URL đầy đủ của ảnh
 * @param path URL tương đối của ảnh
 * @returns URL chính xác của ảnh
 */
export const getImageUrl = (path?: string): string => {
    if (!path) {
        return 'https://i.pinimg.com/736x/6b/4b/b9/6b4bb99c31679504834a2015f39bd236.jpg';
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${API_CONFIG.baseURL}${path}`;
};

interface TempImageData {
    base64: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    timestamp: number;
}

// Helper function
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const tempStorage = {
    // Lưu ảnh tạm thời vào localStorage
    saveToTemp: async (key: string, file: File): Promise<string> => {
        try {
            const base64 = await fileToBase64(file);
            const tempData: TempImageData = {
                base64,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                timestamp: Date.now()
            };

            localStorage.setItem(`temp_image_${key}`, JSON.stringify(tempData));

            // Tạo blob URL để preview
            const blobUrl = URL.createObjectURL(file);
            return blobUrl;
        } catch (error) {
            console.error('Failed to save to temp storage:', error);
            throw error;
        }
    },

    // Lấy 1 ảnh tạm thời từ localStorage
    getOneTemp: (key: string): File | null => {
        try {
            const data = localStorage.getItem(`temp_image_${key}`);
            if (!data) return null;

            const tempData: TempImageData = JSON.parse(data);

            // Convert base64 back to File
            const byteCharacters = atob(tempData.base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            return new File([byteArray], tempData.fileName, {
                type: tempData.fileType,
                lastModified: tempData.timestamp
            });
        } catch (error) {
            console.error('Failed to get from temp storage:', error);
            return null;
        }
    },

    // Lấy tất cả ảnh tạm thời từ localStorage
    getAllTemp: (): string[] => {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp_image_')) {
                keys.push(key.replace('temp_image_', ''));
            }
        }
        return keys;
    },

    // Xóa 1 ảnh tạm thời khỏi localStorage
    removeFromTemp: (key: string): void => {
        localStorage.removeItem(`temp_image_${key}`);
    },

    // Xóa tất cả ảnh tạm thời khỏi localStorage
    clearAllTemp: (): void => {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp_image_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}



