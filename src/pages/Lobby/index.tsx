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
// LanguageIcon can be used or a simple text button for "VI"
// import LanguageIcon from '@mui/icons-material/Language';

import styles from './styles.module.scss';
import { Player, Room } from '@project/types';
import { QuestionSet } from '@project/types/question';
import { mockQuestionSets } from '@project/mocks/QuestionSet';
import { mockPlayers } from '@project/mocks/Player';

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
                const questionSetData = mockQuestionSets.find(qs => qs.id === Number(id));

                const mockRoom: Room = {
                    id: 1,
                    pin: '123456',
                    question_set_id: questionSetData?.id || 0,
                    host_id: 1,
                    type: 'solo',
                    status: 'waiting',
                    created_at: new Date()
                };
                setRoom({
                    id: 1,
                    question_set_id: questionSetData?.id || 0,
                    host_id: 1,
                    type: 'solo',
                    status: 'waiting',
                    created_at: new Date()
                });
                const playerData = mockPlayers.filter(player => player.room_id === Number(id));
                setQuestionSet(questionSetData || null);
                setPlayers(playerData || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id]);

    const handleJoinGame = () => {
        if (playerName.trim()) {
            const newPlayer: Player = {
                id: players.length + 1,
                room_id: room?.id || 0,
                nickname: playerName.trim(),
                score: 0,
                joined_at: new Date()
            };
            setPlayers([...players, newPlayer]);
            setPlayerName('');
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
                    <Button variant="contained" size="small" className={styles.languageButton} sx={{backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': {backgroundColor: 'rgba(0,0,0,0.7)'}}}>
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
                        <Chip key={player.id} label={player.nickname} className={styles.playerChip} />
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
                        OK, đi!
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Lobby;