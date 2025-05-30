import { Room } from '@project/types/room';

export const mockRooms : Room[] = [
    {
        id: 1,
        question_set_id: 1,
        host_id: 1,
        type: 'solo',
        status: 'waiting',
        created_at: new Date('2023-10-01T10:00:00Z'),
    },
    {
        id: 2,
        pin: '654321',
        question_set_id: 2,
        host_id: 2,
        type: 'live',
        status: 'progress',
        created_at: new Date('2023-10-02T11:00:00Z'),
    },
    {
        id: 3,
        question_set_id: 3,
        host_id: 3,
        type: 'solo',
        status: 'ended',
        created_at: new Date('2023-10-03T12:00:00Z'),
    },
];