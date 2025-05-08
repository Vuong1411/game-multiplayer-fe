import { Box, Grid } from '@mui/material';
// @project
import styles from './styles.module.scss';
import QuestionSetCard from '../../Card/QuestionSetCard';
import { QuestionSet } from '../../../../types/question';

interface QuestionSetListProps {
    questionSets: QuestionSet[];
    onQuizClick?: (id: string) => void;
}

const QuestionSetList = ({ questionSets, onQuizClick }: QuestionSetListProps) => {
    return (
        <Box className={styles.listWrapper}>
            <Grid container spacing={2}>
                {questionSets.map((quiz) => (
                    <Grid key={quiz.id}>
                        <QuestionSetCard quiz={quiz} onClick={() => onQuizClick?.(quiz.id)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default QuestionSetList;