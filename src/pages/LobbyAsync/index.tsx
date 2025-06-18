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
    Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
// @project
import styles from './styles.module.scss';
import { QuestionSet, User, Player } from '@project/types';
import { roomService, questionSetService, playerService, userService } from '@project/services';
import CommonDialog from '@project/components/common/Dialog';
import { useDialog } from '@project/hooks/useDialog';

const LobbyAsync = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { pin, isHost } = location.state || {};
    const navigate = useNavigate();
    const { dialogProps, showDialog } = useDialog();
    const hasShownDialog = useRef(false);
    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [host, setHost] = useState<User | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [nickName, setNickName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isHost && !hasShownDialog.current) {
            console.warn('User is not the host, redirecting to join page');
            hasShownDialog.current = true;
            // Show dialog using hook
            showDialog({
                type: 'error',
                title: 'Truy cập bị từ chối',
                message: 'Bạn không phải là người tổ chức phòng này.',
                description: 'Đây là phòng chơi solo chỉ có người tổ chức mới có thể vào.',
                icon: <DoNotDisturbAltIcon />,
                tip: 'Hãy tạo phòng chơi cá nhân để tận hưởng trò chơi.',
                primaryButton: {
                    label: 'Về trang chủ',
                    onClick: () => navigate('/', { replace: true }),
                    color: 'error'
                },
                closable: false
            });
            return;
        }

        const fetchData = async () => {
            try {
                if (!id) return;
                // Lấy dữ liệu phòng từ url
                const roomData = await roomService.getById(Number(id));
                if (roomData) {
                    // Lấy bộ câu hỏi từ phòng
                    const questionSetData = await questionSetService.getById(roomData.question_set_id);
                    setQuestionSet(questionSetData);
                    // Lấy thông tin chủ phòng
                    const hostData = await userService.getById(roomData.host_id);
                    setHost(hostData || null);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id, isHost, showDialog]);

    // Hàm xử lý khi người dùng rời phòng
    const handleLeaveGame = async (playerId: number) => {
        try {
            if (!playerId) return;

            await playerService.delete(playerId);
            setPlayers(players.filter(player => player.id !== playerId));
        } catch (error) {
            console.error('Failed to leave game:', error);
        }
    };

    // Hàm xử lý khi bắt đầu trò chơi
    const handleStartGame = async () => {
        if (!id || !pin || !nickName.trim()) return;

        if (players.some(player => player.nickname === nickName.trim())) {
            setError('Biệt danh đã được sử dụng. Vui lòng chọn biệt danh khác.');
            return;
        }

        try {
            // Bước 1: Tạo người chơi mới
            const playerId = await playerService.create(pin, nickName.trim());
            if (playerId) {
                // Bước 2: Cập nhật danh sách người chơi
                const newPlayer: Player = {
                    id: playerId,
                    nickname: nickName.trim(),
                    room_id: Number(id),
                    score: 0,
                    joined_at: new Date()
                };
                setPlayers([...players, newPlayer]);

                // Bước 3: Update room status thành 'started'
                await roomService.update(Number(id), { status: 'started' });

                // Bước 4: Chuyển thẳng đến trang game với questionSetId
                navigate(`/game/solo/${id}`, {
                    state: {
                        player: newPlayer,
                        pin: pin,
                        isHost: true
                    },
                    replace: true
                });

                setNickName('');
                setError(null);
            }
        } catch (error: any) {
            console.error('Failed to join and start game:', error);
            setError(error.message || 'Không thể bắt đầu trò chơi. Vui lòng thử lại.');
        }
    };

    return (
        <Box className={styles.lobbyContainer}>
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
                    QUIZ!
                </Typography>

                <Box className={styles.playersDisplay}>
                    {players.map((player) => (
                        <Chip
                            key={player.id}
                            label={player.nickname}
                            className={styles.playerChip}
                            onDelete={() => handleLeaveGame(player.id)}
                            deleteIcon={<PersonIcon />}
                        />
                    ))}
                </Box>
            </Box>

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
                        onClick={handleStartGame}
                        disabled={!nickName.trim()}
                    >
                        Vào phòng!
                    </Button>
                </Box>
            </Box>

            {/* Hiển thị dialog */}
            <CommonDialog {...dialogProps} />

            {/* Sử dụng Snackbar */}
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

export default LobbyAsync;