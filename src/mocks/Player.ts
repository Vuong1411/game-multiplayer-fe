import { Player } from '@project/types/room';

// Mock data for players
export const mockPlayers: Player[] = [
    {
        id: 1,
        room_id: 1,
        nickname: 'Robyn',
        avatar_url: 'https://example.com/avatar1.png',
        score: 0,
        joined_at: new Date('2023-10-01T10:00:00Z')
    },
    {
        id: 2,
        room_id: 1,
        nickname: 'Nancy',
        avatar_url: 'https://example.com/avatar2.png',
        score: 0,
        joined_at: new Date('2023-10-01T10:05:00Z')
    },
    {
        id: 3,
        room_id: 1,
        nickname: 'Mal',
        avatar_url: 'https://example.com/avatar3.png',
        score: 0,
        joined_at: new Date('2023-10-01T10:10:00Z')
    },
    {
        id: 4,
        room_id: 1,
        nickname: 'Shima',
        avatar_url: 'https://example.com/avatar4.png',
        score: 0,
        joined_at: new Date('2023-10-01T10:15:00Z')
    }
];