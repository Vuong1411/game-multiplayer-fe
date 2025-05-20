import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
// Icons
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import GridViewIcon from '@mui/icons-material/GridView';
// @project
import styles from './styles.module.scss';
import QuestionCard from '../../components/detail/QuestionCard';
import ActionBar from '../../components/detail/ActionBar';
import { QuestionSet, Question, Answer } from '../../types/question';
import { mockQuestionSets } from '../../mocks/QuestionSet';
import { mockQuestions, mockAnswers } from '../../mocks/Question';
//import { questionSetService } from '../../services/questionSet.service';
//import { questionService } from '../../services/question.service';

const Detail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<{
        question: Question;
        answers: Answer[];
    }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setQuestionSet(mockQuestionSets.find(qs => qs.id === Number(id)) || null);
                const questions = mockQuestions.filter(q => q.question_set_id === Number(id));

                setQuestionsWithAnswers(
                    questions.map(question => ({
                        question,
                        answers: mockAnswers.filter(answer => answer.question_id === question.id),
                    }))
                );
            } catch (err) {
                console.error('Failed to fetch quiz:', err);
            }
        };

        fetchData();
    }, [id]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
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
                            <Tooltip title="Chỉnh sửa" onClick={() => handleNavigation(`/creator/${id}`)}>
                                <IconButton className={styles.navButton}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Yêu thích">
                                <IconButton className={styles.navButton}>
                                    <StarOutlineIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Tùy chọn">
                                <IconButton className={styles.navButton}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Tooltip>
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
                                src={questionSet?.image_url || "/quiz-placeholder.jpg"}
                                alt={questionSet?.title || "Quiz"}
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
                                {questionSet?.title}
                            </Typography>

                            <Typography variant="body1" className={styles.quizDescription}>
                                {questionSet?.description || "Lịch sử thần thoại"}
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
                            {questionsWithAnswers.map(({question, answers}) => {
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
                <Box className={styles.actionBarContainer}>
                    <ActionBar />
                </Box>
            </Box>
        </>
    );
};

export default Detail;