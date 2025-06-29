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
