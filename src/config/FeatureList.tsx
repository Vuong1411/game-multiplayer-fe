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
import FeatureCard from '../Card/FeatureCard';

const colors = [
    '#f97316', '#2563eb', '#a855f7', '#eab308',
    '#16a34a', '#dc2626', '#0891b2', '#ec4899'
];

const features = [
    {
        title: 'Tạo câu hỏi',
        description: 'Tạo câu hỏi trắc nghiệm dễ dàng',
        icon: <QuestionAnswer />,
        path: '/create-question'
    },
    {
        title: 'Lecture Mode',
        description: 'Chế độ trình chiếu bài giảng',
        icon: <PresentToAll />,
        path: '/lecture-mode'
    },
    {
        title: 'Trình tạo AI',
        description: 'Tạo câu hỏi tự động với AI',
        icon: <SmartToy />,
        path: '/ai-generator'
    },
    {
        title: 'Google Slides',
        description: 'Tích hợp với Google Slides',
        icon: <Slideshow />,
        path: '/google-slides'
    }
];

const FeatureList = () => {
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
        centerMode: true,
        centerPadding: '60px',
        variableWidth: true, // Enable variable width
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '40px',
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '30px',
                }
            }
        ],
        beforeChange: () => setIsDragging(true),
        afterChange: () => setTimeout(() => setIsDragging(false), 100),
    };

    // This function will only navigate if the user is not dragging the slider
    const handleClick = (path: string) => {
        if (!isDragging) {
            navigate(path);
        }
    };

    return (
        <Box
            sx={{
                '& .slick-track': {
                    display: 'flex',
                    gap: 2,
                    margin: '0 -8px',
                },
                '& .slick-slide': {
                    height: 'auto',
                    '& > div': {
                        height: '100%',
                    },
                },
                '& .slick-list': {
                    margin: '0 -8px',
                },
                px: 4,
            }}
        >
            <Slider {...settings}>
                {features.map((feature, index) => (
                    <Box
                        key={index}
                        sx={{
                            p: 1,
                            height: '100%',
                            display: 'flex',
                        }}
                    >
                        <FeatureCard
                            {...feature}
                            color={shuffledColors[index]}
                            onClick={() => handleClick(feature.path)}
                        />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default FeatureList;