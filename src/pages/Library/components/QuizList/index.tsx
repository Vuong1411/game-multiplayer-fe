import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
// @project
import styles from './styles.module.scss';
import { QuestionSet } from '../../../../types/question';
import QuizCard from '../../../../components/common/Card/QuizCard';

interface MyQuizListProps {
    questionSets: QuestionSet[];
}

const MyQuizList = ({ questionSets }: MyQuizListProps) => {
    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
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

export default MyQuizList;