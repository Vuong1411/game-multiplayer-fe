import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Optional vì không cần hiển thị trong form
  role: 'user' | 'admin';
  created_at: string;
}

// Tạo một instance axios riêng với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_URL
});

// Thêm interceptor để tự động gắn token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Đảm bảo token có định dạng "Bearer <token>"
      const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = finalToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userService = {
  // Lấy danh sách người dùng
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Tạo người dùng mới (đăng ký)
  createUser: async (userData: Omit<User, 'id' | 'created_at'>): Promise<User> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data.user;
  },

  // Cập nhật profile của người dùng
  updateProfile: async (userId: number, userData: { username?: string; email?: string }) => {
    const response = await apiClient.put('/users/profile', {
      ...userData,
      userId // Thêm userId vào request body
    });
    return response.data;
  },

  // Cập nhật vai trò người dùng
  updateUserRole: async (id: number, role: User['role']) => {
    const response = await apiClient.put(`/users/${id}/role`, { role });
    return response.data;
  },

  // Xóa người dùng
  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id: number, userData: { username?: string; email?: string }) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
}; 