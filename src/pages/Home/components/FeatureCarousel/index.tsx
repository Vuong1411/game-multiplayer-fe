import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Slider from 'react-slick';
import {
    QuestionAnswer,
    Slideshow,
    SmartToy,
    PresentToAll
} from '@mui/icons-material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// @project
import styles from './styles.module.scss';
import FeatureCard from '@project/components/common/Card/FeatureCard';
import { getColor } from '@project/utils/Color';

const features = [
    {
        title: 'Tạo câu hỏi',
        description: 'Tạo câu hỏi trắc nghiệm dễ dàng',
        icon: <QuestionAnswer />,
        path: '/creator'
    },
    {
        title: 'Lecture Mode',
        description: 'Chế độ trình chiếu bài giảng',
        icon: <PresentToAll />,
        path: '/creator'
    },
    {
        title: 'Trình tạo AI',
        description: 'Tạo câu hỏi tự động với AI',
        icon: <SmartToy />,
        path: '/creator'
    },
    {
        title: 'Google Slides',
        description: 'Tích hợp với Google Slides',
        icon: <Slideshow />,
        path: '/creator'
    }
];

const FeatureCarousel = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);

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
                    centerPadding: '40px',
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '30px',
                }
            }
        ],
        beforeChange: () => setIsDragging(true),
        afterChange: () => setTimeout(() => setIsDragging(false), 100),
    };

    const handleNavigation = (path: string) => {
        if (!isDragging) {
            navigate(path);
        }
    };

    return (
        <Box className={styles.carouselWrapper}>
            <Slider {...settings}>
                {features.map((feature, index) => (
                    <Box
                        key={index}
                        className={styles.slideWrapper}
                    >
                        <FeatureCard
                            {...feature}
                            color={getColor(index)}
                            onClick={() => handleNavigation(feature.path)}
                        />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default FeatureCarousel;