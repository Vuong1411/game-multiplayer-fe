import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// @project
import styles from './styles.module.scss';
import TopicCard from '../../Card/TopicCard';
import mathImg from '../../../../assets/images/topic/math.png';

const colors = [
    '#f97316', '#2563eb', '#a855f7', '#eab308',
    '#16a34a', '#dc2626', '#0891b2', '#ec4899'
];

const topics = [
    {
        title: 'Toán học',
        description: 'Các bài tập và câu hỏi về toán',
        image: mathImg,
        path: '/create-question'
    },
    {
        title: 'Vật lý',
        description: 'Khám phá thế giới vật lý',
        image: mathImg,
        path: '/create-question'
    },
    {
        title: 'Hóa học',
        description: 'Thế giới của phản ứng hóa học',
        image: mathImg,
        path: '/create-question'
    },
    {
        title: 'Sinh học',
        description: 'Khoa học về sự sống',
        image: mathImg,
        path: '/create-question'
    }
];

const TopicCarousel = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
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

    const handleClick = (path: string) => {
        if (!isDragging) {
            navigate(path);
        }
    };

    return (
        <Box className={styles.carouselWrapper}>
            <Slider {...settings}>
                {topics.map((topic, index) => (
                    <Box 
                        key={index} 
                        className={styles.slideWrapper}
                    >
                        <TopicCard
                            {...topic}
                            color={shuffledColors[index]}
                            onClick={() => handleClick(topic.path)}
                        />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default TopicCarousel;