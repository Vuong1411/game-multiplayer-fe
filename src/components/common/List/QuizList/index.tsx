import { Box, Grid } from '@mui/material';
// @project
import styles from './styles.module.scss';
import QuizCard from '../../Card/QuizCard';
import { QuestionSet } from '../../../../types/quiz';

interface QuizListProps {
    quizzes: QuestionSet[];
    onQuizClick?: (id: string) => void;
}

const QuizList = ({ quizzes, onQuizClick }: QuizListProps) => {
    return (
        <Box className={styles.listWrapper}>
            <Grid container spacing={2}>
                {quizzes.map((quiz) => (
                    <Grid>
                        <QuizCard quiz={quiz} onClick={() => onQuizClick?.(quiz.id)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default QuizList;