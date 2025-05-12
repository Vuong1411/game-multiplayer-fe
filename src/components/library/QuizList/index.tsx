import { Box, Grid } from '@mui/material';
// @project
import styles from './styles.module.scss';
import QuizCard from '../../common/Card/QuizCard';
import { QuestionSet } from '../../../types/question';

interface MyQuizListProps {
    questionSets: QuestionSet[];
    onQuizClick?: (id: string) => void;
}

const MyQuizList = ({ questionSets, onQuizClick }: MyQuizListProps) => {
    return (
        <Box className={styles.listWrapper}>
            <Grid container spacing={2}>
                {questionSets.map((quiz) => (
                    <Grid key={quiz.id}>
                        <QuizCard quiz={quiz} onClick={() => onQuizClick?.(quiz.id)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MyQuizList;