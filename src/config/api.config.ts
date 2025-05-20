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
            getById: (id: number) => `/api/question-sets/${id}`,
            create: '/api/question-sets',
            update: (id: number) => `/api/question-sets/${id}`,
            delete: (id: number) => `/api/question-sets/${id}`
        },
        question: {
            getAll: (question_set_id: number) => `/api/questions/${question_set_id}`,
            getById: (id: number) => `/api/questions/${id}`,
        }
    }
};