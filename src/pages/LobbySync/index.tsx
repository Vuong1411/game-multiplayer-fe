import { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
// @project
import styles from './styles.module.scss';
import { useGame } from '@project/contexts/GameContext';
import { QuestionSet, User } from '@project/types';
import { roomService, questionSetService, userService } from '@project/services';
import CommonDialog from '@project/components/common/Dialog';
import { useDialog } from '@project/hooks/useDialog';

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
        startGame,
        setPin,
        setIsHost
    } = useGame();
    

    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [host, setHost] = useState<User | null>(null);
    const [hasJoined, setHasJoined] = useState(false);
    const [nickName, setNickName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { dialogProps, showDialog } = useDialog();
    const hasShownDialog = useRef(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    useEffect(() => {
        if (!pin && !hasShownDialog.current) {
            console.warn('User is not the host, redirecting to join page');
            hasShownDialog.current = true;
            // Show dialog using hook
            showDialog({
                type: 'error',
                title: 'Truy cập bị từ chối',
                message: 'Bạn cần mã PIN để tham gia phòng LIVE này.',
                description: 'Đây là phòng chơi thời gian thực, cần mã PIN để tham gia.',
                icon: <DoNotDisturbAltIcon />,
                tip: 'Nhận mã PIN từ người tổ chức phòng.',
                primaryButton: {
                    label: 'Nhập PIN',
                    onClick: () => navigate('/join', { replace: true }),
                    color: 'error'
                },
                closable: false
            });
            return;
        }

        if (pin) {
            setPin(pin);
            setIsHost(isHost);
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
    }, [pin, id, showDialog]);

    useEffect(() => {
        if (gameStarted) {
            setCountdown(5);

            // Tạo interval để cập nhật mỗi giây
            const intervalId = setInterval(() => {
                setCountdown(prev => {
                    if (prev === null || prev <= 0) return 0;
                    return prev - 1;
                });
            }, 1000);

            // Tạo timeout riêng cho việc navigate
            const navigateTimeout = setTimeout(() => {
                navigate(`/game/live/${id}`, {
                    state: {
                        nickName: nickName?.trim() || '',
                        pin,
                        isHost
                    },
                    replace: true
                });
            }, 5000);

            // Cleanup khi unmount
            return () => {
                clearInterval(intervalId);
                clearTimeout(navigateTimeout);
            };
        }
    }, [gameStarted]);

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
        setHasJoined(true);
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
                            helperText={error ? "Vui lòng sửa lỗi trên" : hasJoined ? "Đã tham gia với biệt danh này" : ""}
                            disabled={hasJoined}
                        />

                        <Button
                            variant="contained"
                            onClick={handleJoinGame}
                            disabled={!nickName.trim() || hasJoined}
                        >
                            {hasJoined ? 'Đã vào phòng' : 'Vào phòng!'}
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Hiển thị dialog */}
            <CommonDialog {...dialogProps} />

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

            {/* Overlay đếm ngược */}
            {countdown !== null && countdown > 0 && (
                <Box className={styles.countdownOverlay}>
                    <Box className={styles.countdownContainer}>
                        <Typography variant="h1" className={styles.countdownNumber}>
                            {countdown}
                        </Typography>
                        <Typography variant="h4" className={styles.countdownText}>
                            Game bắt đầu trong...
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default LobbySync;