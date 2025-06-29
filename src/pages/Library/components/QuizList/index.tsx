import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
// @project
import styles from './styles.module.scss';
import { QuestionSet } from '@project/types/question';
import QuizCard from '@project/components/common/Card/QuizCard';

interface MyQuizListProps {
    questionSets: QuestionSet[];
}

const QuizList = ({ questionSets }: MyQuizListProps) => {
    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
    }

    // Kiểm tra nếu không có dữ liệu
    if (questionSets.length === 0) {
        return (
            <Box className={styles.emptyContainer}>
                <Typography variant="h6" className={styles.emptyMessage}>
                    Không có quiz nào
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Hiện chưa có quiz nào trong danh sách này
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.listWrapper}>
            <Grid container spacing={2}>
                {questionSets.map((quiz) => (
                    <Grid key={quiz.id}>
                        <QuizCard
                            quiz={quiz} 
                            onClick={() => handleNavigation(`/details/${quiz.id}`)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default QuizList;