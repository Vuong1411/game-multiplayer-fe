export interface QuestionSet {
    id: number;
    title: string;
    author: string;
    questions: number;
    description?: string;
    image_url?: string;
}

export interface Question {
    id: number;
    question_set_id: number;
    content: string;
    type: string;
    point: number;
    time_limit: number; // 10, 15, 20, 30, 45, 60, 90,120
    image_url?: string;
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