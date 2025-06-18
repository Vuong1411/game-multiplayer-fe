import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button
} from '@mui/material';
import ChangeHistorySharpIcon from '@mui/icons-material/ChangeHistorySharp'; // hình tam giác
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar'; // 
import HexagonIcon from '@mui/icons-material/Hexagon'; // hình lục giác
import PentagonIcon from '@mui/icons-material/Pentagon'; // hình ngũ giác
import CircleIcon from '@mui/icons-material/Circle'; // hình tròn
import SquareIcon from '@mui/icons-material/Square'; // hình vuông
import { Answer } from '@project/types/question';
import styles from './styles.module.scss';

interface AnswersGridProps {
    type: string;
    answers: Answer[];
    selectedAnswer: number | null;
    textAnswer: string;
    showResults: boolean;
    onAnswerSelect: (answerId: number) => void;
    onTextSubmit: (text: string) => void;
}

const AnswersGrid = ({
    type,
    answers,
    selectedAnswer,
    textAnswer,
    showResults,
    onAnswerSelect,
    onTextSubmit
}: AnswersGridProps) => {
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        setInputText(textAnswer);
    }, [textAnswer]);

    // Lấy biểu tượng và tên theo index
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

    // Xử lý sự kiện thay đổi input (chỉ áp dụng khi chưa hiển thị kết quả)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!showResults) {
            setInputText(event.target.value);
        }
    }

    // Xử lý sự kiện nhấn phím Enter
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            onTextSubmit(inputText.trim());
        }
    };

    return (
        <Grid container justifyContent="center" spacing={2} className={styles.answersContainer}>
            {answers.map((answer, index) => {
                const { symbol } = getSymbol(index);

                const isSelected = selectedAnswer === answer.id;
                const isCorrect = answer.is_correct;

                // Xác định className dựa trên index
                const answerClass = [
                    styles.answerRed,
                    styles.answerBlue,
                    styles.answerYellow,
                    styles.answerGreen,
                    styles.answerPurple,
                    styles.answerOrange
                ][index % 6];

                // Trắc nghiệm (choice)
                if (type === 'choice') return (
                    <Grid size={6} key={answer.id}>
                        <Box
                            className={`
                                ${styles.answerCard}
                                ${answerClass}
                                ${showResults && isCorrect ? styles.correct : ''}
                                ${showResults && !isCorrect ? styles.incorrect : ''}
                            `}
                            onClick={() => onAnswerSelect?.(answer.id)}
                        >
                            <Box className={styles.symbolContainer}>
                                <Typography className={styles.symbolText}>
                                    {symbol}
                                </Typography>
                            </Box>

                            {/* TextField cho nội dung đáp án */}
                            <Typography variant="body1" className={styles.answerText}>
                                {answer.content}
                            </Typography>
                            {showResults && isSelected && (
                                <Box className={styles.resultIcon}>
                                    R
                                </Box>
                            )}
                        </Box>
                    </Grid>
                );
                // Tự luận
                return (
                    <Grid size={8} key={answer.id}>
                        <Box className={`${styles.answerCard} ${styles.textAnswerCard}`}>

                            {/* TextField cho nội dung đáp án */}
                            <TextField
                                value={inputText}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder={'Viết câu trả lời chi tiết...'}
                                disabled={showResults || textAnswer !== ''}
                                fullWidth
                                inputProps={{
                                    className: styles.textAnswerInput
                                }}
                            />
                            {!textAnswer && !showResults && (
                                <Button
                                    variant="contained"
                                    onClick={() => onTextSubmit(inputText.trim())}
                                    disabled={!inputText.trim()}
                                    className={styles.textSubmitButton}
                                    size="large"
                                >
                                    Gửi
                                </Button>
                            )}
                        </Box>
                        {showResults && textAnswer && (
                            <Box className={styles.resultContainer}>
                                <Typography variant="body2" className={styles.resultText}>
                                    <strong>Câu trả lời của bạn:</strong> "{textAnswer}"
                                </Typography>
                                {answers[0] && (
                                    <Typography variant="body2" className={styles.correctAnswerText}>
                                        <strong>Đáp án đúng:</strong> "{answers[0].content}"
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default AnswersGrid;