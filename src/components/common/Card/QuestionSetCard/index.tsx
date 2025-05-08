import { Box, Card, Chip, CardMedia, CardContent, Typography } from '@mui/material';
// @project
import styles from './styles.module.scss';
import { QuestionSet } from '../../../../types/question';

export interface QuestionSetCardProps {
    quiz: QuestionSet;
    color: string;
    onClick?: (id: string) => void;
}

const QuestionSetCard = ({ quiz, color, onClick }: QuestionSetCardProps) => {
    return (
        <Card
            onClick={() => onClick?.(quiz.id)}
            className={styles.card}
            sx={{ 
                '&.MuiCard-root': {
                    backgroundColor: color
                }
            }}
        >
            <Box className={styles.chipContainer}>
                <Chip 
                    label="Kahoot" 
                    size="small" 
                    className={`${styles.chip} ${styles.kahoot}`}
                />
                <Chip 
                    label="Miễn phí" 
                    size="small" 
                    className={`${styles.chip} ${styles.free}`}
                />
            </Box>
            <Box className={styles.mediaWrapper}>
                <CardMedia
                    component="img"
                    image={quiz.image}
                    alt={quiz.title}
                    className={styles.media}
                />
                <Box className={styles.questionsCount}>
                    {quiz.questions} Câu hỏi
                </Box>
            </Box>
            <CardContent className={styles.content}>
                <Typography className={styles.title}>
                    {quiz.title}
                </Typography>
                <Typography className={styles.author}>
                    {quiz.author}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default QuestionSetCard;