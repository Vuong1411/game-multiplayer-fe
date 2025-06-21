// pages/GameAsync/components/GameHeader/index.tsx
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import styles from './styles.module.scss';

interface GameHeaderProps {
    currentQuestionIndex: number;
    totalQuestions: number;
    timeLeft: number;
    timeLimit: number;
    totalScore: number;
}

const GameHeader = ({ 
    currentQuestionIndex, 
    totalQuestions, 
    timeLeft, 
    timeLimit, 
    totalScore 
}: GameHeaderProps) => {
    // ✅ Calculate progress percentage
    const progressPercentage = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 0;
    
    return (
        <Box className={styles.gameHeader}>
            {/* Question Progress */}
            <Box className={styles.questionProgress}>
                <Chip 
                    label={`${currentQuestionIndex + 1}/${totalQuestions}`}
                    sx={{ 
                        backgroundColor: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        height: '40px',
                        minWidth: '80px'
                    }}
                />
            </Box>

            {/* Timer Section */}
            <Box className={styles.timerSection}>
                <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage}
                    sx={{ 
                        width: '100%',
                        height: '12px', 
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: timeLeft > 10 ? '#4CAF50' : timeLeft > 5 ? '#FF9800' : '#F44336',
                            borderRadius: '6px'
                        }
                    }}
                />
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: 'white', 
                        mt: 1,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    {timeLeft}s
                </Typography>
            </Box>

            {/* Score Section */}
            <Box className={styles.scoreSection}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    🏆 {totalScore.toLocaleString()} điểm
                </Typography>
            </Box>
        </Box>
    );
};

export default GameHeader;