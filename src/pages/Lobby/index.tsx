import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Button,
    TextField,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    IconButton,
    Chip // Added Chip for player names
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import styles from './styles.module.scss';
import { Player, Room } from '@project/types';
import { QuestionSet } from '@project/types/question';
import { mockQuestionSets } from '@project/mocks/QuestionSet';
import { mockPlayers } from '@project/mocks/Player';
import { mockRooms } from '@project/mocks/Room';
import { roomService, questionSetService, playerService } from '@project/services';

const Lobby = () => {
    const { id } = useParams<{ id: string }>();
    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [players, setPlayers] = useState<Player[] | []>([]);
    const [playerName, setPlayerName] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                // Lấy dữ liệu phòng từ url
                const roomData = mockRooms.find(room => room.id === Number(id));
                setRoom(roomData || null);
                // Lấy bộ câu hỏi từ phòng
                const questionSetData = mockQuestionSets.find(qs => qs.id === roomData?.question_set_id);
                setQuestionSet(questionSetData || null);
                // Lấy danh sách người chơi trong phòng
                const playerData = mockPlayers.filter(player => player.room_id === Number(id));
                setPlayers(playerData || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id]);

    // Hàm xử lý khi người dùng join game
    const handleJoinGame = async () => {
        if (!room) return;

        if (playerName.trim()) {
            try {
                // Tạo người chơi mới
                const newPlayer: Partial<Player> = {
                    nickname: playerName,
                    room_id: room.id,
                    score: 0
                };
                // const playerId = await playerService.create(newPlayer);
                
                // if (playerId) {
                //     newPlayer.id = playerId;
                //     setPlayers([...players, newPlayer as Player]);
                //     setPlayerName('');
                // }

                setPlayers([...players, newPlayer as Player]);
                    setPlayerName('');
            } catch (error) {
                console.error('Failed to join game:', error);
            }
        }
    };

    // Hàm xử lý khi người dùng rời phòng
    const handleLeaveGame = async (playerId: number) => {
        try {
            await playerService.delete(playerId);
            setPlayers(players.filter(player => player.id !== playerId));
        } catch (error) {
            console.error('Failed to leave game:', error);
        }
    };

    return (
        <Box className={styles.lobbyContainer}>
            <Box className={styles.topBar}>
                <Box className={styles.playerCount}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body1">{players.length}</Typography>
                </Box>
                <Typography variant="h5" className={styles.pageTitle}>
                    Phòng chờ
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

            <Box className={styles.mainContentArea}>
                {questionSet && (
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
                                <span>Tổ chức bởi: Admin</span>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                <Typography variant="h1" className={styles.kahootBranding}>
                    Kahoot!
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
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        variant="outlined"
                        size="small"
                        className={styles.playerNameInput}
                    />
                    <Button variant="contained" onClick={handleJoinGame}>
                        Vào phòng!
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Lobby;