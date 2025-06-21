import { Box, Typography, Button } from '@mui/material';
import { ArrowForward, Leaderboard } from '@mui/icons-material';
import { Question } from '@project/types';
import styles from './styles.module.scss';
import { getImageUrl } from '@project/utils/Image';

interface QuestionDisplayProps {
    question: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    timeLeft: number;
    onNextQuestion?: () => void;
    onViewLeaderboard?: () => void;
    showResults?: boolean;
}

const QuestionDisplay = ({ 
    question, 
    currentQuestionIndex, 
    totalQuestions,
    timeLeft,
    onNextQuestion,
    onViewLeaderboard,
    showResults = false,
}: QuestionDisplayProps) => {
    
    // Determine timer state for styling
    const getTimerState = () => {
        const percentage = (timeLeft / question.time_limit) * 100;
        if (percentage <= 20) return 'danger';
        if (percentage <= 50) return 'warning';
        return 'normal';
    };

    if (!question) {
        return null;
    }

    return (
        <Box className={styles.questionSection}>
            {/* Header with Question Text */}
            <Box className={styles.questionHeader}>
                <Typography variant="h4" className={styles.questionText}>
                    {question.content}
                </Typography>
            </Box>

            {/* Game Info Bar */}
            <Box className={styles.gameInfoBar}>
                {/* Left side - Timer */}
                <Box className={styles.leftSection}>
                    {showResults ? (
                        <Button
                            variant="contained"
                            onClick={onViewLeaderboard}
                            className={styles.leaderboardButton}
                            size="large"
                            startIcon={<Leaderboard />}
                        >
                            Bảng thành tích
                        </Button>
                    ) : (
                        <Box className={`${styles.timerContainer} ${styles[getTimerState()]}`}>
                            <Typography variant="h3" className={styles.timerText}>
                                {timeLeft}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Center - Image */}
                <Box className={styles.centerSection}>
                    {question.image_url && (
                        <Box className={`${styles.imageContainer} ${styles.slideUp}`}>
                            <img 
                                src={getImageUrl(question.image_url)}
                                alt="Question"
                                className={styles.questionImage}
                                loading="lazy"
                            />
                        </Box>
                    )}
                </Box>

                {/* Right side - Question Progress */}
                <Box className={styles.rightSection}>
                    {showResults ? (
                        <Button
                            variant="contained"
                            onClick={onNextQuestion}
                            className={styles.nextQuestionButton}
                            size="large"
                            endIcon={<ArrowForward />}
                        >
                            {currentQuestionIndex + 1 < totalQuestions ? 'Câu tiếp' : 'Kết thúc'}
                        </Button>
                    ) : (
                        <Box className={styles.questionInfo}>
                            <Typography variant="h5" className={styles.questionCounter}>
                                {currentQuestionIndex + 1} / {totalQuestions}
                            </Typography>
                            <Typography variant="body2" className={styles.questionLabel}>
                                Câu hỏi
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default QuestionDisplay;