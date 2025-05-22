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

const Home = () => {
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await questionSetService.getAll();

                setQuestionSets(data);
            } catch (error) {
                console.error('Failed to fetch question sets:', error);
            }
        };
        fetchData();
    }, []);
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
                        Quiz của tôi
                    </Typography>
                    <QuizCarousel questionSets={questionSets} />
                </Box>
            </Box>
        </>
    );
};

export default Home;