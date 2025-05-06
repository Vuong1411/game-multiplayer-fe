export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    role: 'user' | 'admin';
    created_at: Date;
}