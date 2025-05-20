import { api } from './index';

export const testService = {
  checkConnection: async () => {
    try {
      const response = await api.get('/api/question-sets/1');
      console.log('API Connection successful:', response.data);
      return true;
    } catch (error) {
      console.error('API Connection failed:', error);
      return false;
    }
  }
}