import { Box, Typography } from "@mui/material";
import styles from './styles.module.scss';
// @project
import PromoBannerCard from '../../components/home/BannerCard';
import FeatureCarousel from "../../components/home/FeatureCarousel";
import TopicCarousel from "../../components/home/TopicCarousel";
import QuizCarousel from "../../components/home/QuizCarousel";

const Home = () => {
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
                    <QuizCarousel />
                </Box>
            </Box>
        </>
    );
};

export default Home;