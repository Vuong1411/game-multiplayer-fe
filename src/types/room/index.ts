export interface Room {
    id: number;
    pin?: string;
    question_set_id: number;
    host_id: number;
    type: string;       // 'solo' | 'live'
    status: string;     // 'waiting' | 'progress' | 'ended'
    created_at?: Date;
    ended_at?: Date;
}

export interface Player {
    id: number;
    room_id: number;
    nickname: string;
    avatar_url?: string;
    score: number;
    joined_at: Date;
}

export interface PlayerAnswer {
    player_id: number;
    question_id: number;
    answer_id?: number | null;
    answer_text?: string | null;
    is_correct: boolean;
    response_time: number;
    points: number;
}