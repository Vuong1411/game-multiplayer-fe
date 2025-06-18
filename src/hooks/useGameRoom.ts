import { useEffect, useState } from 'react';
import { useSocket } from '@project/contexts/SocketContext';
import { socketConfig } from '@project/config/socket.config';
import { Player } from '@project/types/room';
import { playerService } from '@project/services/player.service';

export const useGameRoom = (pin: string) => {
    const { socket, isConnected } = useSocket();
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Database
    useEffect(() => {
        const fetchDB = async () => {
            if (!pin) return;

            try {
                setIsLoading(true);

                const playersData = await playerService.getByPin(pin);
                console.log('Players from database:', playersData);
                setPlayers(playersData);
            } catch (error) {
                console.error('Error fetching players from database:', error);
                setPlayers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDB();
    }, [pin]);

    // Socket events
    useEffect(() => {
        if (!isConnected || !socket) return;

        if (pin) {
            socket.emit(socketConfig.events.HOST_JOIN_ROOM, { pin });
        }

        // Real-time updates
        socket.on(socketConfig.events.PLAYER_JOINED, (data) => {
            console.log('Player joined:', data);
            setPlayers(prev => [...prev, data.player]);
        });

        socket.on(socketConfig.events.PLAYER_LEFT, (data) => {
            console.log('Player left:', data);
            setPlayers(prev => prev.filter(player => player.id !== data.socketId));
        });

        socket.on(socketConfig.events.GAME_STARTED, () => {
            console.log('Game started');
            setGameStarted(true);
        });

        socket.on(socketConfig.events.PLAYER_ANSWERED, (data) => {
            console.log('Player answered:', data);
            // Cập nhật điểm số của player
            setPlayers(prev => prev.map(player =>
                player.id === data.playerId
                    ? { ...player, score: (player.score || 0) + data.points }
                    : player
            ));
        });

        socket.on(socketConfig.events.ERROR, (error) => {
            console.error('Socket error:', error);
            setError(error.message);
        });

        return () => {
            socket.off(socketConfig.events.PLAYER_JOINED);
            socket.off(socketConfig.events.PLAYER_LEFT);
            socket.off(socketConfig.events.GAME_STARTED);
            socket.off(socketConfig.events.PLAYER_ANSWERED);
            socket.off(socketConfig.events.ERROR);
        };
    }, [socket, isConnected]);

    const joinRoom = (player: { nickname: string }) => {
        if (socket && isConnected && pin) {
            setIsLoading(true);
            setError(null);

            socket.emit(socketConfig.events.JOIN_ROOM, { pin, player });
            setIsLoading(false);
        }
    };

    const leaveRoom = () => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.LEAVE_ROOM, pin);
        }
    };

    const startGame = () => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.START_GAME, pin);
        }
    };

    const submitAnswer = (answerData: {
        playerId: number;
        questionId: number;
        answerId: number;
        isCorrect: boolean;
        responseTime: number;
        points: number;
    }) => {
        if (socket && isConnected) {
            socket.emit(socketConfig.events.SUBMIT_ANSWER, {
                ...answerData,
                pin
            });
        }
    };

    const nextQuestion = (question: any) => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.NEXT_QUESTION, { pin, question });
        }
    };

    const gameOver = () => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.GAME_OVER, { pin });
        }
    };


    return {
        players,
        isConnected,
        gameStarted,
        isLoading,
        error,
        joinRoom,
        leaveRoom,
        startGame,
        submitAnswer,
        nextQuestion,
        gameOver
    };
};
