// components/GameAsync/Leaderboard/index.tsx
import { Box, Typography, Card, Button } from '@mui/material';
import { 
    EmojiEvents, 
    Refresh, 
    Home,
    CheckCircle,
    Cancel,
    Timeline,
    Timer
} from '@mui/icons-material';
// @project
import styles from './styles.module.scss';

interface ResultProps {
    totalScore?: number;
    correctAnswers: number;
    totalQuestions: number;
    totalTime: number;
    onRestart: () => void;
    onBackToHome: () => void;
}

const Result = ({ 
    totalScore, 
    correctAnswers, 
    totalQuestions, 
    totalTime,
    onRestart, 
    onBackToHome 
}: ResultProps) => {
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return (
        <Box className={styles.resultsContainer}>
            <Card className={styles.resultsCard}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <EmojiEvents sx={{ fontSize: '48px', color: '#FFD700', mr: 2 }} />
                    <Typography variant="h3" sx={{ textAlign: 'center', color: '#333' }}>
                        Hoàn thành!
                    </Typography>
                </Box>

                <Box className={styles.scoreDisplay}>
                    <Typography variant="h1" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                        {totalScore}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#666' }}>
                        điểm
                    </Typography>
                </Box>

                <Box className={styles.statsGrid}>
                    <Box className={styles.statItem}>
                        <CheckCircle sx={{ fontSize: '32px', color: '#4CAF50', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                            {correctAnswers}
                        </Typography>
                        <Typography variant="body1">Đúng</Typography>
                    </Box>

                    <Box className={styles.statItem}>
                        <Cancel sx={{ fontSize: '32px', color: '#F44336', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#F44336' }}>
                            {totalQuestions - correctAnswers}
                        </Typography>
                        <Typography variant="body1">Sai</Typography>
                    </Box>

                    <Box className={styles.statItem}>
                        <Timeline sx={{ fontSize: '32px', color: '#FF9800', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#FF9800' }}>
                            {accuracy.toFixed(1)}%
                        </Typography>
                        <Typography variant="body1">Độ chính xác</Typography>
                    </Box>

                    <Box className={styles.statItem}>
                        <Timer sx={{ fontSize: '32px', color: '#2196F3', mb: 1 }} />
                        <Typography variant="h4" sx={{ color: '#2196F3' }}>
                            {totalTime}s
                        </Typography>
                        <Typography variant="body1">Tổng thời gian</Typography>
                    </Box>
                </Box>

                <Box className={styles.actionButtons}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onRestart}
                        startIcon={<Refresh />}
                        sx={{
                            backgroundColor: '#667eea',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            padding: '12px 30px',
                            borderRadius: '50px',
                            mr: 2
                        }}
                    >
                        Chơi lại
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={onBackToHome}
                        startIcon={<Home />}
                        sx={{
                            color: '#667eea',
                            borderColor: '#667eea',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            padding: '12px 30px',
                            borderRadius: '50px'
                        }}
                    >
                        Về trang chủ
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};

export default Result;