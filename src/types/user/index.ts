export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: 'user' | 'admin';
    avatar_url?: string;
    created_at: Date;
}