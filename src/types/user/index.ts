export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: 'user' | 'admin';
    created_at: Date;
    avatar?: string;
}