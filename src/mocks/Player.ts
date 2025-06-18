import { Player } from '@project/types/room';

// Mock data for players
export const mockPlayers = (roomId: number): Player[] => [
    {
        id: 1,
        room_id: roomId, // ✅ Dynamic room_id
        nickname: 'Robyn',
        avatar_url: '',
        score: 1712,
        joined_at: new Date()
    },
    {
        id: 2,
        room_id: roomId,
        nickname: 'Nancy',
        avatar_url: '',
        score: 2008,
        joined_at: new Date()
    },
    {
        id: 3,
        room_id: roomId,
        nickname: 'Mal',
        avatar_url: '',
        score: 572,
        joined_at: new Date()
    },
    {
        id: 4,
        room_id: roomId,
        nickname: 'Shima',
        avatar_url: '',
        score: 1833,
        joined_at: new Date()
    }
];