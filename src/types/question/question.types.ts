export interface QuestionSet {
    id: number;
    title: string;
    author: string; // Tên tác giả
    questions: number;
    description?: string;
    image_url?: string;
}

export interface Question {
    id: number;
    question_set_id: number;
    content: string;
    image_url?: string;
    type: 'choice' | 'text';
    time_limit: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Answer {
    id: number;
    question_id: number;
    content: string;
    is_correct: boolean;
}

export interface Favorite {
    id: number;
    user_id: number;
    question_set_id: number;
}