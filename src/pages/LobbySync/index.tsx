import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    IconButton,
    Chip,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
// @project
import styles from './styles.module.scss';
import { useGameRoom } from '@project/hooks/useGameRoom';
import { QuestionSet, User } from '@project/types';
import { roomService, questionSetService, userService } from '@project/services';

const LobbySync = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { pin, isHost } = location.state || {};
    const {
        players,
        isConnected,
        gameStarted,
        joinRoom,
        leaveRoom,
        startGame
    } = useGameRoom(pin || '');

    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [host, setHost] = useState<User | null>(null);
    const [nickName, setNickName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    useEffect(() => {
        if (!pin) {
            console.warn('No PIN found in location state');
            setShowDialog(true);
            return;
        }

        const fetchData = async () => {
            try {
                if (!id) return;

                const roomData = await roomService.getByPin(pin);
                if (roomData) {
                    const questionSetData = await questionSetService.getById(roomData.question_set_id);
                    setQuestionSet(questionSetData);

                    const hostData = await userService.getById(roomData.host_id);
                    setHost(hostData || null);
                }
            } catch (err) {
                console.error('Error fetching room data:', err);
            }
        };

        fetchData();
    }, [pin]);

    useEffect(() => {
        if (gameStarted) {
            setCountdown(5);
        }
    }, [gameStarted]);

    const handleNoAccess = () => {
        setShowDialog(false);
        navigate('/join', { replace: true });
    };

    const handleJoinGame = () => {
        const trimmedName = nickName.trim();

        if (!trimmedName) {
            setError('Vui lòng nhập biệt danh');
            return;
        }

        if (players.some(player => player.nickname === trimmedName)) {
            setError('Biệt danh đã được sử dụng');
            return;
        }

        joinRoom({ nickname: trimmedName });

        setNickName('');
        setError(null);
    };

    const handleLeaveGame = () => {
        leaveRoom();
    };

    const handleStartGame = () => {
        if (players.length >= 1) {
            startGame();
        } else {
            setError('Cần ít nhất 1 người chơi để bắt đầu');
        }
    };

    return (
        <Box className={styles.lobbyContainer}>
            {/* Connection Status */}
            <Box className={styles.connectionStatus}>
                <Typography
                    variant="caption"
                    sx={{
                        color: isConnected ? 'green' : 'red',
                        fontWeight: 'bold',
                        position: 'fixed',
                        top: 10,
                        right: 10,
                        background: 'rgba(255,255,255,0.9)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        zIndex: 1000
                    }}
                >
                    {isConnected ? '🟢 LIVE' : '🔴 Mất kết nối'}
                </Typography>
            </Box>

            {/* Top Bar */}
            <Box className={styles.topBar}>
                <Box className={styles.playerCount}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body1">{players.length}</Typography>
                </Box>
                <Typography variant="h5" className={styles.pageTitle}>
                    {pin ? `Phòng: ${pin}` : 'Phòng chờ'}
                </Typography>
                <Box className={styles.topRightControls}>
                    <Button variant="contained" size="small" className={styles.languageButton} sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
                        VI
                    </Button>
                    <IconButton size="small" aria-label="sound">
                        <VolumeUpIcon />
                    </IconButton>
                    <IconButton size="small" aria-label="fullscreen">
                        <FullscreenIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Game Starting Overlay */}
            {countdown !== null && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <Box>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Game bắt đầu trong:
                        </Typography>
                        <Typography variant="h1" sx={{
                            fontSize: '6rem',
                            fontWeight: 'bold',
                            color: countdown <= 3 ? '#ff4444' : '#ffffff',
                            textShadow: '0 0 20px rgba(255,255,255,0.5)'
                        }}>
                            {countdown}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Main Content Area */}
            <Box className={styles.mainContentArea}>
                {questionSet ? (
                    <Card className={styles.questionSetCard}>
                        <CardMedia
                            component="img"
                            sx={{ width: 150 }}
                            image={questionSet.image_url}
                            alt={questionSet.title}
                        />
                        <CardContent className={styles.questionSetContent}>
                            <Typography variant="h6" component="div" className={styles.questionSetTitle}>
                                {questionSet.title}
                            </Typography>
                            <Button variant="contained" size="small" className={styles.countdownButton} sx={{ mb: 1, textTransform: 'none' }}>
                                Mở trong: <strong style={{ marginLeft: 4 }}>22 giờ 57 phút</strong>
                            </Button>
                            <Box className={styles.gameInfo}>
                                <span>{questionSet.questions} câu hỏi</span>
                                <span>Tổ chức bởi: {host?.username || 'Admin'}</span>
                            </Box>
                        </CardContent>
                    </Card>
                ) : null}

                <Typography variant="h1" className={styles.branding}>
                    LIVE QUIZ!
                </Typography>

                <Box className={styles.playersDisplay}>
                    {players.map((player) => (
                        <Chip
                            key={player.id}
                            label={player.nickname}
                            className={styles.playerChip}
                            onDelete={() => handleLeaveGame()}
                            deleteIcon={<PersonIcon />}
                        />
                    ))}
                </Box>
            </Box>

            {isHost ? (
                <Box className={styles.hostControls}>
                    <Button
                        className={styles.startGameButton}
                        variant="contained"
                        onClick={handleStartGame}
                        disabled={players.length < 1}
                    >
                        Bắt đầu!
                    </Button>
                </Box>
            ) : (
                <Box className={styles.joinGameArea}>
                    <Typography variant="h6" className={styles.joinGameTitle}>
                        Tham gia trò chơi
                    </Typography>

                    <Box className={styles.joinGameActions}>
                        <TextField
                            label="Nhập biệt danh"
                            value={nickName}
                            onChange={(e) => {
                                setNickName(e.target.value);
                                if (error) setError(null);
                            }}
                            variant="outlined"
                            size="small"
                            className={styles.nickNameInput}
                            error={!!error}
                            helperText={error && "Vui lòng sửa lỗi trên"}
                        />

                        <Button
                            variant="contained"
                            onClick={handleJoinGame}
                            disabled={!nickName.trim()}
                        >
                            Vào phòng!
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Dialog cảnh báo */}
            <Dialog
                open={showDialog}
                onClose={() => { }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        textAlign: 'center'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    py: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                }}>
                    <DoNotDisturbAltIcon />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Truy cập bị từ chối
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2, color: '#333' }}>
                        Bạn cần mã PIN để tham gia phòng LIVE này.
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                        Đây là phòng chơi thời gian thực, cần mã PIN để tham gia.
                    </Typography>
                    <Box sx={{
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: 2,
                        p: 2,
                        mt: 2
                    }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            💡 <strong>Gợi ý:</strong> Nhận mã PIN từ người tổ chức phòng.
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        variant="contained"
                        onClick={handleNoAccess}
                        sx={{
                            minWidth: 120,
                            background: 'linear-gradient(45deg, #ff4444, #ff6666)'
                        }}
                    >
                        Nhập PIN!
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!error}
                autoHideDuration={5000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setError(null)}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LobbySync;