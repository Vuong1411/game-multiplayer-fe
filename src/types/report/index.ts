export interface RoomReport {
    room_id: number;
    title: string;
    status: string;
    created_at: string;
    ended_at: string;
    total_players: number;
}

export interface RoomReportDetails {
    room_id: number;
    pin: string;
    room_type: string;
    status: string;
    created_at: string;
    ended_at: string;
    host_id: number;
    host_username: string;
    question_set_title: string;
    total_players: number;
    total_questions: number;
    total_correct_answers: number;
    total_wrong_answers: number;
    avg_response_time: number;
}

export interface PlayerReport {
    id: number;
    nickname: string;
    score: number;
    correct_answers: number;
    wrong_answers: number;
}

export interface PlayerAnswerReport {
    question_id: number;
    question_content: string;
    answer_id: number | null;
    answer_content?: string | null;
    answer_text?: string | null;
    is_correct: boolean;
    response_time: number | null;
    points: number | null;
}

export interface QuestionReport {
    question_id: number;
    question_content: string;
    question_image: string | null;
    correct_count: number;
    total_count: number;
    correct_percent: number;
}


