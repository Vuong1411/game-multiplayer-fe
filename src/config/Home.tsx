import {
    Box,
    Container,
    Typography,
} from "@mui/material";
// @project
import PromoBannerCard from '../components/common/Card/BannerCard';
import FeatureCarousel from "../components/common/Carousel/FeatureCarousel";
import TopicCarousel from "../components/common/Carousel/TopicCarousel";
import QuizCarousel from "../components/common/Carousel/QuizCarousel";

const Home = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(45deg, #f3f4f6 30%, #ffffff 90%)'
        }}>
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box
                    sx={{
                        pt: 5,
                        pb: 5,
                        textAlign: 'center'
                    }}
                >
                    <Box
                        sx={{
                            mb: 3,
                            py: 3,
                            px: { xs: 2, md: 4 }
                        }}
                    >
                        <PromoBannerCard />
                    </Box>
                    {/* Features Section */}
                    <Box
                        sx={{
                            mb: 3,
                            py: 3,
                            px: { xs: 2, md: 4 }
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                mb: 6,
                                fontWeight: 600,
                                position: 'relative',
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 60,
                                    height: 4,
                                    backgroundColor: 'primary.main',
                                    borderRadius: 2
                                }
                            }}
                        >
                            Tính năng nổi bật
                        </Typography>
                        <FeatureCarousel />
                    </Box>


                    <Box
                        sx={{
                            mb: 3,
                            py: 3,
                            px: { xs: 2, md: 4 }
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                mb: 6,
                                fontWeight: 600,
                                position: 'relative',
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 60,
                                    height: 4,
                                    backgroundColor: 'primary.main',
                                    borderRadius: 2
                                }
                            }}
                        >
                            Chủ đề
                        </Typography>
                        <TopicCarousel />
                    </Box>
                    <Box
                        sx={{
                            mb: 3,
                            py: 3,
                            px: { xs: 2, md: 4 }
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                mb: 6,
                                fontWeight: 600,
                                position: 'relative',
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 60,
                                    height: 4,
                                    backgroundColor: 'primary.main',
                                    borderRadius: 2
                                }
                            }}
                        >
                            Quiz của tôi
                        </Typography>
                        <QuizCarousel />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;