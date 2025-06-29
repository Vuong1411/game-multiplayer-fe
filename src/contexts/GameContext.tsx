import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocket } from '@project/contexts/SocketContext';
import { socketConfig } from '@project/config/socket.config';
import { Player, Question, Answer, PlayerAnswer } from '@project/types';
import { playerService } from '@project/services';

// Định nghĩa type cho GameContext
interface GameContextType {
    // Loading & Error states
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;

    // Game states
    pin: string | null;
    isHost: boolean;
    gameStarted: boolean;
    gameFinished: boolean;
    gameStartTime: Date | null;
    timeLeft: number;
    showLeaderboard: boolean;
    isLoadingQuestion: boolean;

    // Data states
    players: Player[];
    playerAnswers: PlayerAnswer[];
    totalQuestions: number;
    questionIds: number[];
    question: Question | null;
    answers: Answer[];
    currentIndex: number;

    // Methods
    setPin: (pin: string) => void;
    setIsHost: (isHost: boolean) => void;
    joinRoom: (player: { nickname: string }) => void;
    leaveRoom: () => void;
    startGame: () => void;
    getGameData: () => void;
    submitAnswer: (playerAnswer: Partial<PlayerAnswer>) => void;
    nextQuestion: () => Promise<void>;
    setShowLeaderboard: (show: boolean) => void;
    gameOver: () => void;
}

// Tạo context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Game Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { socket, isConnected } = useSocket();

    // Local state
    const [pin, setPin] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);

    // Loading & Error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Game states
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
    const [questionEndTime, setQuestionEndTime] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

    // Data states
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswer[]>([]);
    const [questionIds, setQuestionIds] = useState<number[]>([]);
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);

    // Fetch players from API
    useEffect(() => {
        const fetchPlayers = async () => {
            if (!pin) return;

            try {
                setIsLoading(true);
                setError(null);
                const playersData = await playerService.getByPin(pin);
                setPlayers(playersData);
            } catch (error) {
                setError('Không thể tải danh sách người chơi');
                setPlayers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayers();
    }, [pin, playerAnswers, players.length]);

    // Socket event handlers
    const handleSocketError = (error: any) => {
        console.error('Socket error:', error);
        setError(error.message);
    };

    const handlePlayerJoined = (data: { player: Player }) => {
        setPlayers(prev => [...prev, data.player]);
    };

    const handlePlayerLeft = (data: { player_id: number }) => {
        console.log('Player left:', data);
        setPlayers(prev => prev.filter(player => player.id !== data.player_id));
    };

    const handleGameStarted = () => {
        setGameStarted(true);
        setError(null);
    };

    const handleGameData = (data: { questionIds: number[], question: Question; answers: Answer[] }) => {
        setGameStartTime(new Date());

        setQuestion(data.question);
        setAnswers(data.answers);
        setQuestionIds(data.questionIds);
        setCurrentIndex(0);

        const timeLimit = data.question.time_limit || 30;
        setTimeLeft(timeLimit);
        setQuestionEndTime(Date.now() + timeLimit * 1000);
    };

    const handlePlayerAnswered = (data: { playerAnswers: PlayerAnswer[] }) => {
        console.log('Player answered:', data);
        setPlayerAnswers(data.playerAnswers);
    };

    const handleNextQuestion = (data: { question: Question; answers: Answer[], index: number }) => {
        
        setQuestion(data.question);
        setAnswers(data.answers);
        setCurrentIndex(data.index);
        setShowLeaderboard(false);
        setIsLoadingQuestion(false);

        const timeLimit = data.question.time_limit || 30;
        setTimeLeft(timeLimit);
        setQuestionEndTime(Date.now() + timeLimit * 1000);
    };

    const handleGameFinished = () => {
        setGameFinished(true);
    };

    // Set up socket event listeners
    useEffect(() => {
        if (!socket || !isConnected) return;

        if (pin && isHost) {
            socket.emit(socketConfig.events.HOST_JOIN_ROOM, { pin });
            setError(null);
        }

        socket.on(socketConfig.events.ERROR, handleSocketError);
        socket.on(socketConfig.events.PLAYER_JOINED, handlePlayerJoined);
        socket.on(socketConfig.events.PLAYER_LEFT, handlePlayerLeft);
        socket.on(socketConfig.events.GAME_STARTED, handleGameStarted);
        socket.on(socketConfig.events.GAME_DATA, handleGameData);
        socket.on(socketConfig.events.PLAYER_ANSWERED, handlePlayerAnswered);
        socket.on(socketConfig.events.NEXT_QUESTION, handleNextQuestion);
        socket.on(socketConfig.events.GAME_FINISHED, handleGameFinished);

        return () => {
            socket.off(socketConfig.events.ERROR, handleSocketError);
            socket.off(socketConfig.events.PLAYER_JOINED, handlePlayerJoined);
            socket.off(socketConfig.events.PLAYER_LEFT, handlePlayerLeft);
            socket.off(socketConfig.events.GAME_STARTED, handleGameStarted);
            socket.off(socketConfig.events.GAME_DATA, handleGameData);
            socket.off(socketConfig.events.PLAYER_ANSWERED, handlePlayerAnswered);
            socket.off(socketConfig.events.NEXT_QUESTION, handleNextQuestion);
            socket.off(socketConfig.events.GAME_FINISHED, handleGameFinished);
        };
    }, [isConnected, socket, pin, isHost]);

    // Tính thời gian đếm ngược
    useEffect(() => {
        if (!questionEndTime || gameFinished || isLoadingQuestion) return;

        const intervalId = setInterval(() => {
            const remaining = Math.max(0, Math.floor((questionEndTime - Date.now()) / 1000));
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(intervalId);
            }
        }, 200);

        return () => clearInterval(intervalId);
    }, [questionEndTime, gameFinished, isLoadingQuestion]);

    /**
     * Tham gia phòng chơi
     * @param player Thông tin người chơi
     */
    const joinRoom = (player: { nickname: string }) => {
        if (socket && isConnected && pin) {
            setIsLoading(true);
            setError(null);

            socket.emit(socketConfig.events.JOIN_ROOM, { pin, player });
            setIsLoading(false);
        }
    };

    /**
     * Rời khỏi phòng chơi
     */
    const leaveRoom = () => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.LEAVE_ROOM, { pin });
        }
    };

    /**
     * Bắt đầu trò chơi
     */
    const startGame = () => {
        if (socket && isConnected && pin && isHost) {
            socket.emit(socketConfig.events.START_GAME, { pin });
        }
    };

    /**
     * Lấy dữ liệu trò chơi
     */
    const getGameData = () => {
        if (socket && isConnected && pin) {
            setIsLoading(true);
            setError(null);
            socket.emit(socketConfig.events.GET_GAME_DATA, { pin });
            setIsLoading(false);
        }
    };

    /**
     * Gửi câu trả lời của người chơi
     * @param playerAnswer Đáp án của người chơi
     */
    const submitAnswer = (playerAnswer: Partial<PlayerAnswer>) => {
        if (socket && isConnected && pin) {
            socket.emit(socketConfig.events.SUBMIT_ANSWER, {
                data: {
                    pin,
                    ...playerAnswer
                }
            });
        }
    };

    /**
     * Chuyển sang câu hỏi tiếp theo
     */
    const nextQuestion = async () => {
        if (socket && isConnected && pin && isHost) {
            const nextIndex = currentIndex + 1;
            if (nextIndex < questionIds.length) {
                setIsLoadingQuestion(true);
                socket.emit(socketConfig.events.NEXT_QUESTION, {
                    pin,
                    question_id: questionIds[nextIndex],
                    index: nextIndex
                });
            } else {
                gameOver();
            }
        }
    };

    /**
     * Kết thúc trò chơi
     */
    const gameOver = () => {
        if (socket && isConnected && pin && isHost) {
            socket.emit(socketConfig.events.GAME_OVER, { pin });
        }
    };

    // Context value
    const contextValue: GameContextType = {
        // State values
        isConnected,
        isLoading,
        error,
        pin,
        isHost,
        gameStarted,
        gameFinished,
        gameStartTime,
        timeLeft,
        showLeaderboard,
        isLoadingQuestion,
        players,
        playerAnswers,
        totalQuestions: questionIds.length,
        questionIds,
        question,
        answers,
        currentIndex,

        // Methods
        setPin,
        setIsHost,
        joinRoom,
        leaveRoom,
        startGame,
        getGameData,
        submitAnswer,
        nextQuestion,
        setShowLeaderboard,
        gameOver
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

// Hook để sử dụng GameContext
export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};