import { ManagerOptions, SocketOptions } from 'socket.io-client';

type SocketConfig = {
  url: string;
  options: Partial<ManagerOptions & SocketOptions>;
  enabled: boolean;
  events: Record<string, string>;
};

export const socketConfig: SocketConfig = {
  url: import.meta.env.VITE_WS_URL,

  options: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    autoConnect: true,
    rememberUpgrade: true,
    timestampRequests: true,
  },

  enabled: import.meta.env.VITE_ENABLE_SOCKET !== 'false',

  events: {
    // Connection events
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    ERROR: 'error',

    // Client to Server events
    HOST_JOIN_ROOM: 'host-join-room',
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
    START_GAME: 'start-game',
    NEXT_QUESTION: 'next-question',
    SUBMIT_ANSWER: 'submit-answer',
    SHOW_LEADERBOARD: 'show-leaderboard',
    GAME_OVER: 'game-over',
    TEST_EVENT: 'test-event',
    GET_GAME_DATA: 'get-game-data',

    // Server to Client events
    PLAYER_JOINED: 'player-joined',
    PLAYER_LEFT: 'player-left',
    PLAYER_ANSWERED: 'player-answered',
    GAME_STARTED: 'game-started',
    GAME_FINISHED: 'game-finished',
    TEST_RESPONSE: 'test-response',
    TIME_SYNCED: 'time-synced',
    GAME_DATA: 'game-data',

  },
};