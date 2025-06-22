export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    endpoints: {
        auth: {
            login: '/api/auth/login',
            register: '/api/auth/register',
            me: '/api/auth/me',
            googleLogin: '/api/auth/google-login',
            forgotPassword: '/api/auth/forgot-password', 
            resetPassword: '/api/auth/reset-password',   
        },
        user: {
            getAll: '/api/users',
            getById: (id: number) => `/api/users/${id}`,
            getByUsername: (username: string) => `/api/users/by-username?username=${username}`,
            getByEmail: (email: string) => `/api/users/by-email?email=${email}`,
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
            getByPin: (pin: string) => `/api/rooms/by-pin?pin=${pin}`,
            create: '/api/rooms',
            update: (id: number) => `/api/rooms/${id}`,
            delete: (id: number) => `/api/rooms/${id}`
        },
        player: {
            getAll: (room_id: number) => `/api/players?room_id=${room_id}`,
            getByPin: (pin: string) => `/api/players/by-pin?pin=${pin}`,
            getById: (id: number) => `/api/players/${id}`,
            create: '/api/players',
            update: (id: number) => `/api/players/${id}`,
            delete: (id: number) => `/api/players/${id}`
        },
        playerAnswer: {
            getByPlayer: (player_id: number) => `/api/player-answers?player_id=${player_id}`,
            getByRoom: (room_id: number) => `/api/player-answers?room_id=${room_id}`,
            getByQuestion: (question_id: number) => `/api/player-answers?question_id=${question_id}`,
            getById: (id: number) => `/api/player-answers/${id}`,
            create: '/api/player-answers',
            update: (id: number) => `/api/player-answers/${id}`,
            delete: (id: number) => `/api/player-answers/${id}`
        },

    }
};