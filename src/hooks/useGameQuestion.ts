// hooks/useGameQuestions.ts
import { useEffect, useState } from 'react';
import { useSocket } from '@project/contexts/SocketContext';
import { socketConfig } from '@project/config/socket.config';

export const useGameQuestions = (pin: string, playerId: number) => {
    const { socket, isConnected } = useSocket();
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (!socket || !isConnected) return;

        socket.on(socketConfig.events.NEXT_QUESTION, (data) => {
            setCurrentQuestion(data.question);
        });

        socket.on('game-over', () => {
            setGameOver(true);
        });

        return () => {
            socket.off(socketConfig.events.NEXT_QUESTION);
            socket.off('game-over');
        };
    }, [socket, isConnected]);

    const submitAnswer = (questionId: number, answerId: number, responseTime: number) => {
        if (socket && isConnected) {
            socket.emit(socketConfig.events.SUBMIT_ANSWER, {
                pin,
                playerId,
                questionId,
                answerId,
                isCorrect: true, // Calculate on client or let server decide
                responseTime,
                points: 100 // Calculate based on your logic
            });
        }
    };

    return {
        currentQuestion,
        gameOver,
        submitAnswer
    };
};