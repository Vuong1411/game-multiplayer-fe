import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import { Question, Answer, PlayerAnswer, Player } from '@project/types';
import { roomService, questionService, answerService, playerAnswerService } from '@project/services';
import { QuestionDisplay, Leaderboard, AnswersGrid, Result } from './components';
import { mockPlayers } from '@project/mocks/Player';

const GameAsync = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { player: initialPlayer, isHost } = location.state || {};
    const navigate = useNavigate();

    // Game states
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<{
        question: Question;
        answers: Answer[];
    }[]>([]); // Danh sách câu hỏi và đáp án
    const [current, setCurrent] = useState<{
        question: Question;
        answers: Answer[];
    }>(); // Câu hỏi và đáp án hiện tại

    const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số câu hỏi hiện tại
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Đáp án đã chọn
    const [textAnswer, setTextAnswer] = useState<string>(''); // Đáp án dạng text

    const [timeLeft, setTimeLeft] = useState(30); // Thời gian còn lại cho câu hỏi
    const [showResults, setShowResults] = useState(false); // Hiển thị kết quả câu hỏi
    const [showLeaderboard, setShowLeaderboard] = useState(false); // Hiển thị bảng xếp hạng
    const [gameFinished, setGameFinished] = useState(false); // Trạng thái kết thúc game

    // Player states
    const [player, setPlayer] = useState<Player>(initialPlayer || null);
    const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswer[]>([]); // Lưu trữ đáp án của người chơi
    const [correctAnswers, setCorrectAnswers] = useState(0); // Số câu trả lời đúng
    const [gameStartTime, setGameStartTime] = useState<Date | null>(null); // Thời gian bắt đầu game
    const [players, setPlayers] = useState<Player[]>(mockPlayers(Number(id)));

    const [submit, setSubmit] = useState(false); // Trạng thái submit câu trả lời

    // Load question set và questions
    useEffect(() => {
        const fetchData = async () => {
            if (!isHost) {
                console.warn('User is not the host, redirecting to join page');
                return;
            }

            try {
                // Fetch room data
                const roomData = await roomService.getById(Number(id));
                if (!roomData) {
                    console.error('Room not found');
                    return;
                }

                // Fetch questions and answers
                const questionsData = await questionService.getAll(roomData.question_set_id);
                const questionsList = await Promise.all(
                    questionsData.map(async (question) => ({
                        question,
                        answers: await answerService.getAll(question.id),
                    }))
                );
                setQuestionsWithAnswers(questionsList);

                if (questionsData && questionsData.length > 0) {
                    setCurrent(questionsList[0]);
                    setTimeLeft(questionsData[0].time_limit || 30);
                    setGameStartTime(new Date());
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchLocalStorage = () => {

            const savedGameData = localStorage.getItem(`game-data-${id}`);
            const savedGameState = localStorage.getItem(`game-state-${id}`);

            if (!savedGameData || !savedGameState) {
                console.log('No saved data found in localStorage');
                return false;
            }

            try {
                const gameData = JSON.parse(savedGameData);
                const gameState = JSON.parse(savedGameState);

                // Khôi phục questions và answers
                setQuestionsWithAnswers(gameData.questionsWithAnswers || []);

                // Khôi phục game state
                setCurrentIndex(gameState.currentIndex);
                setCurrent(gameData.questionsWithAnswers[gameState.currentIndex]);
                setSelectedAnswer(gameState.selectedAnswer);
                setTextAnswer(gameState.textAnswer);
                setShowResults(gameState.showResults);
                setPlayerAnswers(gameState.playerAnswers || []);
                setCorrectAnswers(gameState.correctAnswers || 0);
                setGameStartTime(new Date(gameState.gameStartTime));

                // Tính toán thời gian còn lại
                const currentTime = Date.now();
                const questionStartTime = gameState.questionStartTime || currentTime;
                const currentQuestion = gameData.questionsWithAnswers[gameState.currentIndex];
                const timeLimit = currentQuestion?.question.time_limit || 30;
                const elapsedTime = Math.floor((currentTime - questionStartTime) / 1000);
                const remainingTime = Math.max(0, timeLimit - elapsedTime);

                setTimeLeft(remainingTime);

                // Nếu thời gian đã hết và chưa submit
                if (remainingTime <= 0 && !gameState.showResults && !gameState.selectedAnswer && !gameState.textAnswer) {
                    setTimeout(() => {
                        if (currentQuestion?.question.type === 'multiple_choice') {
                            handleAnswerSelect(null);
                        } else {
                            handleTextSubmit('');
                        }
                    }, 100);
                }

                console.log('Game data restored from localStorage');
                return true;
            } catch (error) {
                console.error('Error parsing saved game data:', error);
                localStorage.removeItem(`game-data-${id}`);
                localStorage.removeItem(`game-state-${id}`);
                return false;
            }
        }

        const initializeGame = () => {
            console.log('Initializing game...');
            const loadedFromLocal = fetchLocalStorage();

            console.log('Loaded from local:', loadedFromLocal);

            // Nếu không load được từ localStorage, fetch từ database
            if (!loadedFromLocal) {
                console.log('Loading from database...');
                fetchData();
            }
        };

        initializeGame();
    }, [id, isHost]);

    // Lưu trữ game state vào localStorage
    useEffect(() => {
         if (current && gameStartTime && questionsWithAnswers.length > 0) {
            const gameState = {
                currentIndex,
                selectedAnswer,
                textAnswer,
                showResults,
                playerAnswers,
                correctAnswers,
                gameStartTime: gameStartTime.getTime(),
                questionStartTime: Date.now() - ((current.question.time_limit || 30) - timeLeft) * 1000,
            };

            const gameData = {
                questionsWithAnswers
            };

            localStorage.setItem(`game-data-${id}`, JSON.stringify(gameData));
            localStorage.setItem(`game-state-${id}`, JSON.stringify(gameState));
        }
    }, [current, currentIndex, selectedAnswer, textAnswer, showResults, playerAnswers, correctAnswers, gameStartTime, questionsWithAnswers, id]);

    // Bổ sung player vào danh sách player
    useEffect(() => {
        if (player) {
            setPlayers(prev => {
                const existingPlayerIndex = prev.findIndex(p => p.id === player.id);

                if (existingPlayerIndex !== -1) {
                    // Cập nhật player đã tồn tại
                    const updatedPlayers = [...prev];
                    updatedPlayers[existingPlayerIndex] = { ...player };
                    return updatedPlayers;
                } else {
                    // Thêm player mới vào danh sách
                    return [...prev, { ...player }];
                }
            });
        }
    }, [player]);

    // Timer countdown
    useEffect(() => {
        //  Nếu thời gian còn lại > 0 và không hiển thị kết quả, không kết thúc game
        if (timeLeft > 0 && !showResults && !gameFinished) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }

        // Nếu thời gian còn lại = 0 và chưa submit
        if (timeLeft === 0 && !submit) {
            if (current?.question.type === 'choice') {
                handleAnswerSelect(null);
            } else {
                handleTextSubmit('');
            }
        }

        // Nếu game kết thúc xóa localStorage
        if (gameFinished) {
            // Cập nhật trạng thái phòng
            const updateRoom = async () => {
                const message = await roomService.update(Number(id), { status: 'ended' });
                console.log(message);
            };
            updateRoom();

            // Xóa localStorage
            localStorage.removeItem(`game-data-${id}`);
            localStorage.removeItem(`game-state-${id}`);
        }

    }, [timeLeft, showResults, gameFinished, selectedAnswer]);

    // Xử lý khi chọn đáp án (Trắc nghiệm)
    const handleAnswerSelect = async (answerId: number | null) => {
        if (!current || selectedAnswer !== null || submit) return;

        setSelectedAnswer(answerId);
        setSubmit(true);
        try {
            const responseTime = (current.question.time_limit) - timeLeft;
            const points = await playerAnswerService.create({
                player_id: player.id,
                question_id: current.question.id,
                answer_id: answerId,
                response_time: responseTime
            });
            const isCorrect = Number(points) > 0;
            if (isCorrect) {
                setCorrectAnswers(prev => prev + 1);
            }

            const playerAnswer: PlayerAnswer = {
                player_id: player.id,
                question_id: current.question.id,
                answer_id: answerId || null,
                is_correct: isCorrect,
                response_time: responseTime,
                points: points || 0
            };

            setPlayerAnswers(prev => [...prev, playerAnswer]);
            setPlayer(prev => ({ ...prev, score: prev.score + playerAnswer.points }));
            setShowResults(true);

        } catch (error) {
            console.error('Error submitting answer:', error);
        } finally {
            setSubmit(false);
        }
    };

    // Xử lý khi submit đáp án dạng text
    const handleTextSubmit = async (text: string) => {
        if (!current || textAnswer || submit) return;

        setTextAnswer(text);
        setSubmit(true);
        try {
            const responseTime = (current.question.time_limit) - timeLeft;
            const points = await playerAnswerService.create({
                player_id: player.id,
                question_id: current.question.id,
                answer_text: text,
                response_time: responseTime
            });
            const isCorrect = Number(points) > 0;
            if (isCorrect) {
                setCorrectAnswers(prev => prev + 1);
            }

            const playerAnswer: PlayerAnswer = {
                player_id: player.id,
                question_id: current.question.id,
                answer_text: text,
                is_correct: isCorrect,
                response_time: responseTime,
                points: points || 0
            };

            setPlayerAnswers(prev => [...prev, playerAnswer]);
            setPlayer(prev => ({ ...prev, score: prev.score + playerAnswer.points }));
            setShowResults(true);

        } catch (error) {
            console.error('Error submitting text answer:', error);
        } finally {
            setSubmit(false);
        }
    };

    const handleNextQuestion = async () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex < questionsWithAnswers.length) {
            setCurrent(questionsWithAnswers[nextIndex]);
            setCurrentIndex(nextIndex);
            setSelectedAnswer(null);
            setTextAnswer('');
            setShowResults(false);
            setTimeLeft(questionsWithAnswers[nextIndex].question.time_limit || 30);
        } else {
            setGameFinished(true);
        }
    };

    const handleViewLeaderboard = () => {
        setShowLeaderboard(true);
    };

    const handleBackGame = () => {
        setShowLeaderboard(false);
    }
    const handleRestartGame = () => {
        const questionSetId = current?.question?.question_set_id || 
                            questionsWithAnswers[0]?.question?.question_set_id;
        navigate(`/details/${questionSetId}`);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // Render leaderboard if game is finished
    if (gameFinished) {
        const totalTime = gameStartTime ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000) : 0;

        return (
            <Result
                totalScore={player.score}
                correctAnswers={correctAnswers}
                totalQuestions={questionsWithAnswers.length}
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
                    totalQuestions={questionsWithAnswers.length}
                    onBack={handleBackGame}
                />
            ) : (
                <>
                    {current && (
                        <>
                            <QuestionDisplay
                                question={current.question}
                                currentQuestionIndex={currentIndex}
                                totalQuestions={questionsWithAnswers.length}
                                timeLeft={timeLeft}
                                onNextQuestion={handleNextQuestion}
                                onViewLeaderboard={handleViewLeaderboard}
                                showResults={showResults}
                            />
                            <AnswersGrid
                                type={current.question.type}
                                answers={current.answers}
                                selectedAnswer={selectedAnswer}
                                textAnswer={textAnswer}
                                showResults={showResults}
                                onAnswerSelect={handleAnswerSelect}
                                onTextSubmit={handleTextSubmit}
                            />
                        </>
                    )}


                </>
            )}
        </Box>
    );
};

export default GameAsync;