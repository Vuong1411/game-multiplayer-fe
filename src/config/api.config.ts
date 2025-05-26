import { get } from "http";

export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL,
    endpoints: {
        auth: {
            login: '/api/auth/login',
            register: '/api/auth/register',
            me: '/api/auth/me',
        },
        questionSet: {
            getAll: '/api/question-sets',
            getById: (id: number) => `/api/question-sets/${id}`,
            getByUserId: (userId: number) => `/api/question-sets/by-user?user_id=${userId}`,
            getMe: `/api/question-sets/my-sets`,
            create: '/api/question-sets',
            update: (id: number) => `/api/question-sets/${id}`,
            delete: (id: number) => `/api/question-sets/${id}`
        },
        question: {
            getAll: (question_set_id: number) => `/api/questions?question_set_id=${question_set_id}`,
            getById: (id: number) => `/api/questions/${id}`,
            create: '/api/questions',
            update: (id: number) => `/api/questions/${id}`,
            delete: (id: number) => `/api/questions/${id}`
        },
        answer: {
            getAll: (question_id: number) => `/api/answers?question_id=${question_id}`,
            create: '/api/answers',
            update: (id: number) => `/api/answers/${id}`,
            delete: (id: number) => `/api/answers/${id}`
        },
        room: {
            getAll: '/api/rooms',
            getById: (id: number) => `/api/rooms/${id}`,
            create: '/api/rooms',
            join: (roomId: number) => `/api/rooms/${roomId}/join`,
            leave: (roomId: number) => `/api/rooms/${roomId}/leave`,
            start: (roomId: number) => `/api/rooms/${roomId}/start`,
            end: (roomId: number) => `/api/rooms/${roomId}/end`
        },
    }
};