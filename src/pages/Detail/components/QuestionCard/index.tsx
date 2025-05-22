import { Box, Typography, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ChangeHistorySharpIcon from '@mui/icons-material/ChangeHistorySharp';
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';
import HexagonIcon from '@mui/icons-material/Hexagon';
import PentagonIcon from '@mui/icons-material/Pentagon';
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
// @project
import styles from './styles.module.scss';
import { Question, Answer } from '@project/types/question';

interface QuestionCardProps {
    question: Question;
    answers: Answer[];
}

const QuestionCard = ({
    question,
    answers,
}: QuestionCardProps) => {
    // Get symbol based on index
    const getSymbol = (index: number) => {
        switch (index) {
            case 0: return { symbol: <SignalCellular4BarIcon /> };
            case 1: return { symbol: <HexagonIcon /> };
            case 2: return { symbol: <CircleIcon /> };
            case 3: return { symbol: <SquareIcon /> };
            case 4: return { symbol: <PentagonIcon /> };
            case 5: return { symbol: <ChangeHistorySharpIcon /> };
            default: return { symbol: <SignalCellular4BarIcon /> };
        }
    };

    return (
        <Box className={styles.previewContainer}>
            {/* Question title */}
            <Box className={styles.questionTitle}>
                <Typography variant="h5" className={styles.questionText}>
                    {question.content}
                </Typography>
            </Box>

            {/* Question image */}
            {question.image_url && (
                <Box className={styles.imageContainer}>
                    <img
                        src={question.image_url}
                        alt={question.content}
                        className={styles.questionImage}
                    />
                </Box>
            )}

            {/* Answer options */}
            <Grid container justifyContent="center" spacing={0.5} className={styles.answersContainer}>
                {answers.map((answer, index) => {
                    const { symbol } = getSymbol(index);
                    const isCorrect = answer.is_correct;

                    // Determine color class based on index
                    const colorClass = [
                        styles.redAnswer,
                        styles.blueAnswer,
                        styles.yellowAnswer,
                        styles.greenAnswer,
                        styles.purpleAnswer,
                        styles.orangeAnswer
                    ][index % 6];

                    if (question.type === 'choice') return (
                        <Grid size={6} key={answer.id}>
                            <Box className={`${styles.answerCard} ${colorClass}`}>
                                {/* Symbol container */}
                                <Box className={styles.symbolContainer}>
                                    <Typography className={styles.symbolText}>
                                        {symbol}
                                    </Typography>
                                </Box>

                                {/* Answer text */}
                                <Typography className={styles.answerText}>
                                    {answer.content}
                                </Typography>

                                {/* Show checkmark for correct answer when revealed */}
                                {isCorrect ? (
                                    <Box className={styles.correctMark}>
                                        <CheckIcon />
                                    </Box>
                                ) : null}
                            </Box>
                        </Grid>
                    );
                    else return (
                        <Grid size={8} key={answer.id}>
                            <Box
                                className={`${styles.answerCard} ${colorClass}`}
                            >
                                {/* Symbol container */}
                                <Box className={styles.symbolContainer}>
                                    {symbol}
                                </Box>

                                {/* Answer text */}
                                <Typography className={styles.answerText}>
                                    {answer.content}
                                </Typography>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default QuestionCard;