import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Tab, Tabs } from '@mui/material';
// @project
import styles from './styles.module.scss';
import { QuestionSet } from '../../types/quiz';
import QuizList from '../../components/common/List/QuizList';
import img from '../../assets/images/quiz/history.png';

const mockQuizzes: QuestionSet[] = [
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

const Library = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleQuizClick = (id: string) => {
        navigate(`/quiz/${id}`);
    };

    return (
        <>
            <Typography variant="h4" className={styles.title}>
                Thư viện câu hỏi
            </Typography>

            <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                className={styles.tabs}
            >
                <Tab label="Tất cả" />
                <Tab label="Của tôi" />
                <Tab label="Đã lưu" />
            </Tabs>

            <Box className={styles.content}>
                <QuizList 
                    quizzes={mockQuizzes} 
                    onQuizClick={handleQuizClick}
                />
            </Box>
        </>
    );
};

export default Library;