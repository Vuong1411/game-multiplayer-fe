import { Box, Typography } from "@mui/material";
import styles from './styles.module.scss';
// @project
import PromoBannerCard from '../../components/common/Card/BannerCard';
import FeatureCarousel from "../../components/common/Carousel/FeatureCarousel";
import TopicCarousel from "../../components/common/Carousel/TopicCarousel";
import QuizCarousel from "../../components/common/Carousel/QuizCarousel";

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