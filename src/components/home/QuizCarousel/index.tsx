import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// @project
import styles from './styles.module.scss';
import QuizCard from '../../common/Card/QuizCard';
import PlusCard from '../../common/Card/PlusCard';
import { getColor } from '../../../utils/getColor';
import { questionSets } from '../../../mocks/QuestionSet';

const QuizCarousel = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);

    const handleNavigation = (path: string) => {
        if (!isDragging) {
            navigate(path);
        }
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        cssEase: "linear",
        pauseOnHover: true,
        swipeToSlide: true,
        useCSS: true,
        useTransform: true,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                }
            }
        ],
        beforeChange: () => setIsDragging(true),
        afterChange: () => setTimeout(() => setIsDragging(false), 100),
    };

    const quizCards = questionSets.map((quiz, index) => (
        <Box key={index} className={styles.slideWrapper}>
            <QuizCard 
                quiz={quiz} 
                onClick={() => handleNavigation(`/details/${quiz.id}`)} 
                color={getColor(index)}
            />
        </Box>
    ));

    const plusCards = Array.from({ length: 5 }, (_, index) => (
        <Box key={`plus-${index}`} className={styles.slideWrapper}>
            <PlusCard onClick={() => handleNavigation('/creator')} />
        </Box>
    ));


    return (
        <Box className={styles.carouselWrapper}>
        <Slider {...settings}>
            {[...quizCards, ...plusCards]}
        </Slider>
    </Box>
    );
};

export default QuizCarousel;