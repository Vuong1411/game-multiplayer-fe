// hooks/useGameQuestions.ts
import { useEffect, useState } from 'react';
import { useSocket } from '@project/contexts/SocketContext';
import { socketConfig } from '@project/config/socket.config';
import { Question, Answer, PlayerAnswer } from '@project/types';

export const useGameQuestions = (pin: string) => {
    const { socket, isConnected } = useSocket();

    // Game states
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<{
        question: Question;
        answers: Answer[];
    }[]>([]);
    const [current, setCurrent] = useState<{
        question: Question;
        answers: Answer[];
    }>();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [showResults, setShowResults] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);

    // Lắng nghe sự kiện Server
    useEffect(() => {
        if (!socket || !isConnected) return;

        // Nhận bộ câu hỏi từ server khi game bắt đầu
        socket.on(socketConfig.events.GAME_STARTED, (data: { question: Question; answers: Answer[] }[]) => {
            setQuestionsWithAnswers(data);
            if (data.length > 0) {
                setCurrent(data[0]);
                setCurrentIndex(0);
                setTimeLeft(data[0].question.time_limit || 30);
            }
        });

        // Nhận câu hỏi tiếp theo từ server
        socket.on(socketConfig.events.NEXT_QUESTION, (data: { question: Question; answers: Answer[] }) => {
            const  nextIndex = currentIndex + 1;

            if(nextIndex < questionsWithAnswers.length) {
                setCurrent(data);
                setCurrentIndex(nextIndex);
                setShowLeaderboard(false);
                setShowResults(false);
            }
        });

        // Đồng bộ hóa thời gian
        socket.on(socketConfig.events.TIME_UPDATE, (timeLeft: number) => {
            setTimeLeft(timeLeft);
        });

        // Show leaderboard
        socket.on(socketConfig.events.LEADERBOARD, (data: any) => {
            console.log('Show leaderboard:', data);
            setShowLeaderboard(true);
        });

        // Game over
        socket.on(socketConfig.events.GAME_OVER, () => {
            console.log('Game finished');
            setGameFinished(true);
        });

        // Show results
        socket.on(socketConfig.events.RESULTS, (data: any) => {
            console.log('Show results:', data);
            setShowResults(true);
        });

        return () => {
            socket.off(socketConfig.events.GAME_STARTED);
            socket.off(socketConfig.events.NEXT_QUESTION);
            socket.off(socketConfig.events.TIME_UPDATE);
            socket.off(socketConfig.events.LEADERBOARD);
            socket.off(socketConfig.events.GAME_OVER);
            socket.off(socketConfig.events.RESULTS);
        };
    }, [socket, isConnected]);

    /**
     * Bắt đầu trò chơi
     */
    const startGame = () => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.START_GAME, pin);
        }
    };

    /**
     * Câu hỏi tiếp theo
     * @param question Gửi mã câu hỏi tiếp theo
     */
    const nextQuestion = (questionId: any) => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.NEXT_QUESTION, { pin, questionId });
        }
    };

    /**
     * Kết thúc game
     */
    const gameOver = () => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.GAME_OVER, { pin });
        }
    };

    return {
        current,
        gameFinished,
    };
};