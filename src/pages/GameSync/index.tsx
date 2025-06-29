import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import { Player } from '@project/types'
import { QuestionDisplay, Leaderboard, AnswersGrid, Result } from './components';
import { useGame } from '@project/contexts/GameContext';

const GameSync = () => {
    const location = useLocation();
    const { nickName, pin, isHost } = location.state || {};
    const navigate = useNavigate();
    const {
        isConnected,
        players,
        playerAnswers,
        gameStarted,
        gameFinished,
        gameStartTime,
        totalQuestions,
        question,
        answers,
        currentIndex,
        timeLeft,
        showLeaderboard,
        getGameData,
        submitAnswer,
        nextQuestion,
        setShowLeaderboard,
    } = useGame();

    // Player states
    const [player, setPlayer] = useState<Player>();
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [textAnswer, setTextAnswer] = useState<string>('');
    const [submit, setSubmit] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [showResults, setShowResults] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [countedQuestionIds, setCountedQuestionIds] = useState<number[]>([]);

    useEffect(() => {
        if (!pin || !gameStarted || gameFinished) return;
        console.log('Game state:', gameStarted, gameFinished);
        getGameData();
    }, [pin, isConnected]);

    // Load player
    useEffect(() => {
        if (!pin || !nickName || !players) return;

        console.log('Correct:', correctAnswers);
        const fetchData = async () => {
            if (!pin) return;
            try {
                const currentPlayer = players.find(p => p.nickname === nickName);
                setPlayer(currentPlayer);
                console.log('Current player:', currentPlayer);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [pin, players]);

    // Hiển thị đáp án và tự động submit khi hết thời gian
    useEffect(() => {
        if (timeLeft === 0 && !submit && question && !answeredQuestions.has(question.id)) {
            if (question?.type === 'choice') {
                handleAnswerSelect(null);
            } else {
                handleTextSubmit('');
            }
        }

        if (timeLeft === 0) {
            setShowResults(true);
        }
    }, [timeLeft, submit, question]);

    // Reset trạng thái khi chuyển sang câu hỏi mới
    useEffect(() => {
        setSelectedAnswer(null);
        setTextAnswer('');
        setSubmit(false);
        setShowResults(false);
    }, [question?.id]);

    // Cập nhật số câu trả lời đúng của người chơi
    useEffect(() => {
        if (!player || !playerAnswers.length) return;

        const playerAnswer = playerAnswers.find(answer =>
            answer.player_id === player.id &&
            answer.points > 0 &&
            !countedQuestionIds.includes(answer.question_id)
        );

        if (playerAnswer) {
            setCountedQuestionIds(prev => [...prev, playerAnswer.question_id]);
            setCorrectAnswers(prev => prev + 1);
        }
    }, [player?.id, playerAnswers, countedQuestionIds]);

    // Player answer functions
    const handleAnswerSelect = async (answerId: number | null) => {
        if (!question || isHost || !player || selectedAnswer !== null || submit) return;

        setSelectedAnswer(answerId);
        setSubmit(true);
        setAnsweredQuestions(prev => new Set(prev).add(question.id));

        try {
            const responseTime = (question.time_limit || 30) - timeLeft;
            submitAnswer({
                player_id: player.id,
                question_id: question.id,
                answer_id: answerId,
                response_time: responseTime
            });

        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleTextSubmit = async (text: string) => {
        if (!question || isHost || !player || textAnswer || submit) return;

        setTextAnswer(text);
        setSubmit(true);
        setAnsweredQuestions(prev => new Set(prev).add(question.id));

        try {
            const responseTime = (question.time_limit || 30) - timeLeft;
            submitAnswer({
                player_id: player.id,
                question_id: question.id,
                answer_text: text,
                response_time: responseTime
            });

        } catch (error) {
            console.error('Error submitting text answer:', error);
        }
    };

    const handleNextQuestion = async () => {
        if (!question || !isHost) return;
        try {
            await nextQuestion();
        } catch (error) {
            console.error('Error moving to next question:', error);
        }
    }

    const handleViewLeaderboard = () => {
        setShowLeaderboard(true);
    };

    const handleBackGame = () => {
        setShowLeaderboard(false);
    };

    const handleBackToDetails = () => {
        const questionSetId = question?.question_set_id;
        navigate(`/details/${questionSetId}`, { state: { pin, nickName } });
    }

    const handleRestartGame = () => {
        navigate(`/join`);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // Show loading if socket not connected
    if (!isConnected) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Connecting to game server...</div>
            </Box>
        );
    }

    // Render game finished
    if (gameFinished) {
        const totalTime = gameStartTime ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000) : 0;

        if (isHost) {
            return (
                <Box className={styles.gameContainer}>
                    <Leaderboard
                        players={players}
                        playerAnswers={playerAnswers}
                        questionNumber={totalQuestions}
                        totalQuestions={totalQuestions}
                        onBack={handleBackToDetails}
                    />
                </Box>
            );
        }

        return (
            <Result
                totalScore={player?.score}
                correctAnswers={correctAnswers}
                totalQuestions={totalQuestions}
                totalTime={totalTime}
                onRestart={handleRestartGame}
                onBackToHome={handleBackToHome}
            />
        );
    }

    // Render game
    return (
        <Box className={styles.gameContainer}>
            {showLeaderboard ? (
                <Leaderboard
                    players={players}
                    playerAnswers={playerAnswers}
                    questionNumber={currentIndex + 1}
                    totalQuestions={totalQuestions}
                    onBack={handleBackGame}
                />
            ) : (
                <>
                    {question ? (
                        <>
                            <QuestionDisplay
                                question={question}
                                currentQuestionIndex={currentIndex}
                                totalQuestions={totalQuestions}
                                timeLeft={timeLeft}
                                onNextQuestion={handleNextQuestion}
                                onViewLeaderboard={handleViewLeaderboard}
                                showResults={showResults}
                                isHost={isHost}
                            />
                            <AnswersGrid
                                type={question.type}
                                answers={answers}
                                selectedAnswer={selectedAnswer}
                                textAnswer={textAnswer}
                                showResults={showResults}
                                onAnswerSelect={handleAnswerSelect}
                                onTextSubmit={handleTextSubmit}
                                isHost={isHost}
                            />
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <div>Đang tải câu hỏi...</div>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default GameSync;