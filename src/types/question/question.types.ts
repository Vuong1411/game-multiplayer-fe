export interface QuestionSet {
    id: string;
    title: string;
    author: string;
    questions: number;
    description?: string;
    image: string;
}

export interface Question {
    id: string;
    question_set_id: number;
    content: string;
    image_url?: string;
    type: 'choice' | 'text';
    time_limit: number;
    difficulty: 'easy' | 'medium' | 'hard';
    answers?: Answer[];
}

export interface Answer {
    id: string;
    question_id: number;
    content: string;
    is_correct: boolean;
}

export interface Favorite {
    id: string;
    user_id: string;
    question_set_id: string;
}