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
            create: '/api/users',
            changePassword: '/api/users/change-password',
            updateProfile: '/api/users/update-profile',
            update: (id: number) => `/api/users/${id}`,
            delete: (id: number) => `/api/users/${id}`,
        },
        questionSet: {
            search: (query: string) => `/api/question-sets/search?query=${encodeURIComponent(query)}`,
            getAll: '/api/question-sets',
            getMe: `/api/question-sets/me`,
            getById: (id: number) => `/api/question-sets/${id}`,
            getByUserId: (userId: number) => `/api/question-sets/by-user?user_id=${userId}`,
            create: '/api/question-sets',
            update: (id: number) => `/api/question-sets/${id}`,
            delete: (id: number) => `/api/question-sets/${id}`,
            getStats: (id: number) => `/api/question-sets/stats/${id}`,
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
            getBySetId: (question_set_id: number) => `/api/rooms/by-set?question_set_id=${question_set_id}`,
            create: '/api/rooms',
            update: (id: number) => `/api/rooms/${id}`,
            delete: (id: number) => `/api/rooms/${id}`,
            deleteMany: '/api/rooms/delete-many',
            report: (room_id: number) => `/api/rooms/reports/${room_id}`,
            reports: (type: string) => `/api/rooms/reports?type=${type}`,
            getPlayerReports: (room_id: number) => `/api/rooms/player-reports/${room_id}`,
            getQuestionReports: (room_id: number) => `/api/rooms/question-reports/${room_id}`,
            getPlayerAnswerReports: (player_id: number) => `/api/rooms/player-answer-reports/${player_id}`,
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
        report: {
            getAll: '/api/reports',
            getById: (id: number) => `/api/reports/${id}`,
            create: '/api/reports',
            update: (id: number) => `/api/reports/${id}`,
            delete: (id: number) => `/api/reports/${id}`,
            getPlayerReports: (room_id: number) => `/api/reports/player-reports/${room_id}`,
        },

    }
};