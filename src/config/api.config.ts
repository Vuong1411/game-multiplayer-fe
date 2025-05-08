export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL,
    endpoints: {
        auth: {
            login: '/api/auth/login',
            register: '/api/auth/register',
            logout: '/api/auth/logout'
        },
        questionSet: {
            getAll: '/api/question-sets',
            getById: (id: string) => `/api/question-sets/${id}`,
            create: '/api/question-sets',
            update: (id: string) => `/api/question-sets/${id}`,
            delete: (id: string) => `/api/question-sets/${id}`,
            favorite: (id: string) => `/api/question-sets/${id}/favorite`
        },
        question: {
            getAll: (setId: string) => `/api/question-sets/${setId}/questions`,
            getById: (setId: string, id: string) => `/api/question-sets/${setId}/questions/${id}`,
            create: (setId: string) => `/api/question-sets/${setId}/questions`,
            update: (setId: string, id: string) => `/api/question-sets/${setId}/questions/${id}`,
            delete: (setId: string, id: string) => `/api/question-sets/${setId}/questions/${id}`
        },
        answer: {
            getAll: (questionId: string) => `/api/questions/${questionId}/answers`,
            create: (questionId: string) => `/api/questions/${questionId}/answers`,
            update: (questionId: string, id: string) => `/api/questions/${questionId}/answers/${id}`,
            delete: (questionId: string, id: string) => `/api/questions/${questionId}/answers/${id}`
        }
    }
};