import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Container,
    Avatar,
    IconButton,
    Tooltip,
    AppBar,
    Toolbar,
    Snackbar,
    Alert,
} from '@mui/material';
// Icons
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import GridViewIcon from '@mui/icons-material/GridView';
// @project
import styles from './styles.module.scss';
import ActionBar from './components/ActionBar';
import QuestionCard from './components/QuestionCard';
import { useAuth } from '@project/contexts/AuthContext';
import { QuestionSet, Question, Answer } from '@project/types/question';
import { Room } from '@project/types/room';
import { questionSetService, questionService, answerService, roomService } from '@project/services';

const Detail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useAuth();
    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<{
        question: Question;
        answers: Answer[];
    }[]>([]);
    const [playCount, setPlayCount] = useState(0);
    const [playerCount, setPlayerCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
    const [showMobileActionBar, setShowMobileActionBar] = useState(false);

    const toggleMobileActionBar = () => {
        setShowMobileActionBar(prev => !prev);
    };


    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setQuestionSet(await questionSetService.getById(Number(id)));
                const questionsData = await questionService.getAll(Number(id));
                setQuestionsWithAnswers(await Promise.all(
                    questionsData.map(async (question) => ({
                        question,
                        answers: await answerService.getAll(question.id),
                    })))
                );

            } catch (err) {
                console.error('Failed to fetch quiz:', err);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1000);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleEditClick = () => {
        // Kiểm tra quyền edit
        if (!currentUser) {
            setShowAlert(true);
            return;
        }

        // Kiểm tra nếu user hiện tại là tác giả
        if (questionSet?.created_by && Number(currentUser.id) !== questionSet.created_by) {
            setShowAlert(true);
            return;
        }

        handleNavigation(`/creator/${id}`);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleCreateRoom = async (type: 'sync' | 'async' = 'async') => {
        if (!id || !currentUser) {
            setShowAlert(true);
            return;
        }

        try {
            const newRoom: Partial<Room> = {
                question_set_id: Number(id),
                type: type,
                status: 'waiting'
            };

            const result = await roomService.create(newRoom);
            if (result) {
                const { room_id, pin } = result;
                if (type === 'async') {
                    navigate(`/lobby/solo/${room_id}`, {
                        state: {
                            pin: pin.trim(),
                            isHost: true
                        }
                    });
                }
                else {
                    navigate(`/lobby/live/${room_id}`, {
                        state: {
                            pin: pin.trim(),
                            isHost: true
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Failed to create room:', error);
            setShowAlert(true);
        }
    };
    const handleCreateLiveRoom = () => handleCreateRoom('sync');
    const handleCreateSoloRoom = () => handleCreateRoom('async');

    return (
        <>
            {/* Thông báo lỗi */}
            <Snackbar
                open={showAlert}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity="warning"
                    sx={{ width: '100%' }}
                >
                    {!currentUser
                        ? "Bạn cần đăng nhập để thực hiện thao tác này!"
                        : "Chỉ tác giả mới có thể thực hiện này!"
                    }
                </Alert>
            </Snackbar>
            {/* Navbar: toàn màn hình ở trên top */}
            <AppBar className={styles.navbar}>
                <Container maxWidth={false}>
                    <Toolbar className={styles.toolbar}>
                        <Box className={styles.navbarLeft}>
                            <Avatar
                                alt={questionSet?.author || 'Unknown'}
                                src="/avatar-placeholder.png"
                                className={styles.userAvatar}
                            />
                            <Typography variant="body1" className={styles.username}>
                                {questionSet?.author || "Unknown"}
                            </Typography>
                        </Box>

                        <Box className={styles.navbarRight}>
                            <Tooltip title="Chỉnh sửa" onClick={handleEditClick}>
                                <IconButton className={styles.navButton}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>

                            {/* <Tooltip title="Yêu thích">
                                <IconButton className={styles.navButton}>
                                    <StarOutlineIcon />
                                </IconButton>
                            </Tooltip> */}

                            {isMobile && (
                                <Tooltip title="Tùy chọn">
                                    <IconButton
                                        className={styles.navButton}
                                        onClick={toggleMobileActionBar}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Content: Chia 2 cột 1 bên nội dung quiz và 1 bên action bar */}
            <Box className={styles.mainContainer}>
                {/* Quiz Container: Chứa nội dung của quiz */}
                <Box className={styles.quizContainer}>
                    {/* Header Section */}
                    <Box className={styles.quizHeader}>
                        <Box className={styles.quizImageContainer}>
                            <img
                                src={questionSet?.image_url}
                                alt={questionSet?.title}
                                className={styles.quizImage}
                            />
                        </Box>

                        <Box className={styles.infoSection}>
                            <Box className={styles.quizType}>
                                <Box className={styles.quizTypeIcon}>
                                    <GridViewIcon fontSize="small" />
                                </Box>
                                <Typography variant="body2">Kahoot</Typography>
                            </Box>

                            <Typography variant="h4" className={styles.quizTitle}>
                                {questionSet?.title || 'Quiz không có tiêu đề'}
                            </Typography>

                            <Typography variant="body1" className={styles.quizDescription}>
                                {questionSet?.description || 'Không có mô tả cho quiz này.'}
                            </Typography>

                            <Box className={styles.quizStats}>
                                <Box className={styles.statItem}>
                                    <PlayArrowIcon fontSize="small" />
                                    <Typography variant="body2">
                                        {4} lượt chơi
                                    </Typography>
                                </Box>

                                <Box className={styles.statItem}>
                                    <PersonIcon fontSize="small" />
                                    <Typography variant="body2">
                                        {4} người tham gia
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Question Section */}
                    <Box className={styles.questionSection}>
                        <Box className={styles.sectionQuestionHeader}>
                            <Typography variant="h6">Câu hỏi ({questionsWithAnswers.length})</Typography>
                        </Box>

                        <Grid container justifyContent={'center'} spacing={1} className={styles.questionGrid}>
                            {questionsWithAnswers.map(({ question, answers }) => {
                                return (
                                    <Grid key={question.id}>
                                        <QuestionCard
                                            question={question}
                                            answers={answers}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Box>
                {/* Action Bar */}
                <Box className={`${styles.actionBarContainer} ${showMobileActionBar ? styles.mobileShow : ''}`}>
                    <ActionBar
                        onCreateLiveRoom={handleCreateLiveRoom}
                        onCreateSoloRoom={handleCreateSoloRoom}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Detail;