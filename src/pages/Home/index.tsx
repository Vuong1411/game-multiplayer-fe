import { useEffect, useState } from 'react';
import { Box, Typography } from "@mui/material";
import styles from './styles.module.scss';
// @project
import PromoBannerCard from './components/BannerCard';
import FeatureCarousel from "./components/FeatureCarousel";
import TopicCarousel from "./components/TopicCarousel";
import QuizCarousel from "./components/QuizCarousel";
import { QuestionSet } from '@project/types/question';
import { questionSetService } from '@project/services/questionSet.service';
import { useAuth } from '@project/contexts/AuthContext';

const Home = () => {
    const [allQuiz, setAllQuiz] = useState<QuestionSet[]>([]);
    const [myQuiz, setMyQuiz] = useState<QuestionSet[]>([]);
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allQuizData = await questionSetService.getAll();
                setAllQuiz(allQuizData);
                // Nếu người dùng đã đăng nhập, lấy quiz của họ
                if (isAuthenticated) {
                    try {
                        const myQuizData = await questionSetService.getMe();
                        setMyQuiz(myQuizData);
                    } catch (error) {
                        console.error('Failed to fetch my question sets:', error);
                        setMyQuiz([]);
                    }
                } else {
                    setMyQuiz([]);
                }
            } catch (error) {
                console.error('Failed to fetch question sets:', error);
                setAllQuiz([]);
            }
        };
        fetchData();
    }, [isAuthenticated]);
    return (
        <>
            <Box className={styles.section}>
                <Box className={styles.sectionContent}>
                    <PromoBannerCard />
                </Box>

                <Box className={styles.sectionContent}>
                    <Typography variant="h4" className={styles.title}>
                        Tính năng nổi bật
                    </Typography>
                    <FeatureCarousel />
                </Box>

                <Box className={styles.sectionContent}>
                    <Typography variant="h4" className={styles.title}>
                        Chủ đề
                    </Typography>
                    <TopicCarousel />
                </Box>

                <Box className={styles.sectionContent}>
                    <Typography variant="h4" className={styles.title}>
                        Quiz phổ biến
                    </Typography>
                    <QuizCarousel questionSets={allQuiz} />
                </Box>

                <Box className={styles.sectionContent}>
                    <Typography variant="h4" className={styles.title}>
                        Quiz của tôi
                    </Typography>
                    <QuizCarousel questionSets={myQuiz} />
                </Box>
            </Box>
        </>
    );
};

export default Home;