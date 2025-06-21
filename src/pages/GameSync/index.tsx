import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import { Player } from '@project/types'
import { QuestionDisplay, Leaderboard, AnswersGrid, Result } from './components';
import { useGameRoom } from '@project/hooks/useGameRoom';

const GameSync = () => {
    const location = useLocation();
    const { nickName, pin, isHost } = location.state || {};
    const navigate = useNavigate();
    const {
        isConnected,
        players,
        playerAnswers,
        gameFinished,
        gameStartTime,
        totalQuestions,
        question,
        answers,
        currentIndex,
        timeLeft,
        showLeaderboard,
        startGame,
        submitAnswer,
        nextQuestion,
        setShowLeaderboard,
    } = useGameRoom(pin, isHost);

    // Player states
    const [player, setPlayer] = useState<Player>();
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [textAnswer, setTextAnswer] = useState<string>('');
    const [submit, setSubmit] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    useEffect(() => {
    if (!player || !playerAnswers.length) return;
    
    // Tìm câu trả lời của người chơi hiện tại trong các câu trả lời mới
    const playerAnswer = playerAnswers.find(answer => answer.player_id === player.id);

    if (playerAnswer && playerAnswer.points > 0) {
        setCorrectAnswers(prev => prev + 1);
    }
}, [playerAnswers]);
    
    useEffect(() => {
        if (!pin) return;
        startGame();
    }, []);

    // Load player
    useEffect(() => {
        if (!pin || !nickName) return;
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
    }, [pin, players, nickName]);

    useEffect(() => {
        if (timeLeft === 0 && !submit) {
            if (question?.type === 'choice') {
                handleAnswerSelect(null);
            } else {
                handleTextSubmit('');
            }
        }

        if (timeLeft === 0) {
            setShowResults(true);
        }
    });

    useEffect(() => {
        setSelectedAnswer(null);
        setTextAnswer('');
        setSubmit(false);
        setShowResults(false);
    }, [question?.id]);

    // Player answer functions
    const handleAnswerSelect = async (answerId: number | null) => {
        if (!question || isHost || !player || selectedAnswer !== null || submit) return;

        setSelectedAnswer(answerId);
        setSubmit(true);

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
        } finally {
            setSubmit(false);
        }
    };

    const handleTextSubmit = async (text: string) => {
        if (!question || isHost || !player || textAnswer || submit) return;

        setTextAnswer(text);
        setSubmit(true);

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
        } finally {
            setSubmit(false);
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

    const handleRestartGame = () => {
        const questionSetId = question?.question_set_id;
        navigate(`/details/${questionSetId}`);
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
                            />
                            <AnswersGrid
                                type={question.type}
                                answers={answers}
                                selectedAnswer={selectedAnswer}
                                textAnswer={textAnswer}
                                showResults={showResults}
                                onAnswerSelect={handleAnswerSelect}
                                onTextSubmit={handleTextSubmit}
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