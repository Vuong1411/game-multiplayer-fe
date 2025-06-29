import { Box, Typography, Button } from '@mui/material';
import { Timer, SubdirectoryArrowLeft, North } from '@mui/icons-material';
// @project
import styles from './styles.module.scss';
import { Player, PlayerAnswer } from '@project/types';

interface LeaderboardProps {
    players: Player[];
    playerAnswers: PlayerAnswer[];
    questionNumber: number;
    totalQuestions: number;
    onBack?: () => void;
}

// Hiển thị kết quả của từng người chơi
interface PlayerResultDisplay {
    player: Player;
    currentAnswer?: PlayerAnswer; // Câu trả lời hiện tại của người chơi
    rank: number;
}

const Leaderboard = ({
    players,
    playerAnswers,
    questionNumber,
    totalQuestions,
    onBack
}: LeaderboardProps) => {

    const playerResults: PlayerResultDisplay[] = players.map(player => {
        const currentAnswer = playerAnswers
            .filter(answer => answer.player_id === player.id)
            .sort((a, b) => b.question_id - a.question_id)[0];

        return {
            player,
            currentAnswer: currentAnswer,
            rank: 0
        };
    });
    const sortedPlayers = playerResults
        .sort((a, b) => b.player.score - a.player.score)
        .map((result, index) => ({
            ...result,
            rank: index + 1
        }));



    return (
        <Box className={styles.resultsContainer}>
            {/* Header */}
            <Box className={styles.header}>
                <Button
                    variant="contained"
                    onClick={onBack}
                    className={styles.backButton}
                    size="large"
                    startIcon={<SubdirectoryArrowLeft />}
                >
                    Quay lại
                </Button>
                <Typography variant="h4" className={styles.title}>
                    Bảng thành tích
                </Typography>
            </Box>

            {/* Leaderboard */}
            <Box className={styles.leaderboard}>
                {sortedPlayers.map((result) => {
                    const responseTime = result.currentAnswer?.response_time || 0;
                    return (
                        <Box
                            key={result.player.id}
                            className={`
                            ${styles.playerRow}
                            ${result.rank === 1 ? styles.firstPlace : ''}
                        `}
                        >
                            {/* Rank */}
                            <Box className={styles.rank}>
                                <Typography variant="h4">
                                    {result.rank}
                                </Typography>
                            </Box>

                            {/* Player Info */}
                            <Box className={styles.playerInfo}>
                                <Typography variant="h6" className={styles.playerName}>
                                    {result.player.nickname}
                                </Typography>

                                <Box className={styles.responseTime}>
                                    <Timer fontSize="small" />
                                    <Typography variant="caption">
                                        {responseTime.toFixed(1)}s
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Score */}
                            <Box className={styles.scoreBar}>
                                <Box
                                    className={styles.scoreProgress}
                                    style={{
                                        width: `${Math.min((result.player.score / (sortedPlayers[0]?.player.score || 1)) * 100, 100)}%`
                                    }}
                                />
                            </Box>

                            <Box className={styles.scoreDisplay}>
                                <Typography variant="h6" className={styles.totalScore}>
                                    {result.player.score.toLocaleString()}
                                </Typography>
                                {result.currentAnswer?.is_correct ? (
                                    <Box className={styles.scoreIncrease}>
                                        <North className={styles.trendingIcon} />
                                    </Box>
                                ) : ( null )}
                            </Box>
                        </Box>
                    )
                })}
            </Box>

            {/* Progress indicator */}
            <Box className={styles.progressSection}>
                <Typography variant="body2" className={styles.progressText}>
                    Câu hỏi {questionNumber} / {totalQuestions}
                </Typography>
                <Box className={styles.progressBar}>
                    <Box
                        className={styles.progressFill}
                        style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Leaderboard;