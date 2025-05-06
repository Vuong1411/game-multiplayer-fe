import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
// @project
import QuizCard from '../Card/QuizCard';
import PlusCard from '../Card/PlusCard';
import img from '../../../assets/images/quiz/history.png';

const quizData = [
    {
        id: '1',
        title: 'Game lịch sử',
        author: 'Morkaths',
        questions: 19,
        image: img,
    },
    // Add more quizzes here if needed
];

const QuizList = () => {
    const navigate = useNavigate();

    const handleQuizClick = (id: string) => {
        navigate(`/quiz/${id}`);
    };

    const handleCreateQuiz = () => {
        navigate('/creator');
    };

    return (
        <Box 
            sx={{ 
                overflowX: 'auto',
                py: 2,
                '&::-webkit-scrollbar': {
                    height: 8,
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    borderRadius: 4,
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.25)',
                    },
                },
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex',
                    gap: 2,
                    px: 2,
                    '&::after': {
                        content: '""',
                        minWidth: 2,
                    },
                }}
            >
                {/* Quiz Cards */}
                {quizData.map((quiz) => (
                    <QuizCard
                        key={quiz.id}
                        {...quiz}
                        onClick={handleQuizClick}
                    />
                ))}

                {/* Plus Cards */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <PlusCard 
                    key={`plus-${index}`}
                    onClick={handleCreateQuiz}
                />
                ))}
            </Box>
        </Box>
    );
};

export default QuizList;