import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// @project
import styles from './styles.module.scss';
import QuizCard from '../../Card/QuizCard';
import PlusCard from '../../Card/PlusCard';
import img from '../../../../assets/images/quiz/history.png';

const quizData = [
    {
        id: '1',
        title: 'Game lịch sử',
        author: 'Morkaths',
        questions: 19,
        image: img,
    },
    {
        id: '2',
        title: 'Game lịch sử 2',
        author: 'Morkaths',
        questions: 19,
        image: img,
    },
];

const QuizCarousel = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);

    const handleQuizClick = (id: string) => {
        if (!isDragging) {
            navigate(`/quiz/${id}`);
        }
    };

    const handleCreateQuiz = () => {
        if (!isDragging) {
            navigate('/creator');
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

    const quizCards = quizData.map(quiz => (
        <Box key={quiz.id} className={styles.slideWrapper}>
            <QuizCard quiz={quiz} onClick={() => handleQuizClick(quiz.id)} />
        </Box>
    ));

    const plusCards = Array.from({ length: 6 }, (_, index) => (
        <Box key={`plus-${index}`} className={styles.slideWrapper}>
            <PlusCard onClick={handleCreateQuiz} />
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