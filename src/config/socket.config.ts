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
  },
  
  enabled: import.meta.env.VITE_ENABLE_SOCKET !== 'false',
  
  events: {
    // Connection events
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    ERROR: 'error',

    // Client to Server events
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
    START_GAME: 'start-game',
    NEXT_QUESTION: 'next-question',
    SUBMIT_ANSWER: 'submit-answer',
    GAME_OVER: 'game-over',
    TEST_EVENT: 'test-event',

    // Server to Client events
    HOST_JOIN_ROOM: 'host-join-room',
    PLAYER_JOINED: 'player-joined',
    PLAYER_LEFT: 'player-left',
    PLAYER_ANSWERED: 'player-answered',
    GAME_STARTED: 'game-started',
    TEST_RESPONSE: 'test-response',
  },
};