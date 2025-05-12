import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Card,
    Grid,
    Button,
    IconButton
} from '@mui/material';
import TriangleIcon from '@mui/icons-material/ChangeHistory'; // tam giác
import DiamondIcon from '@mui/icons-material/Diamond'; // hình thoi
import CircleIcon from '@mui/icons-material/Circle'; // hình tròn
import SquareIcon from '@mui/icons-material/Square'; // hình vuông
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// @project
import { Question, Answer } from '../../../types/question';
import styles from './styles.module.scss';

interface QuestionPreviewProps {
    question: Question;
    answers: Answer[];
    onAnswerCreate?: () => void;
    onSelectedAnswer?: (answerId: number) => void;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
    question,
    answers,
    onAnswerCreate,
    onSelectedAnswer,
    onAnswerChange
}) => {
    const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

    const handleSelectAnswer = (answerId: number) => {
        setSelectedAnswerId(answerId);
        if (onSelectedAnswer) {
            onSelectedAnswer(answerId);
        }
    };

    // Hàm xử lý khi click vào checkbox để đánh dấu đáp án đúng
    const handleToggleCorrect = (event: React.MouseEvent, answerId: number, isCurrentlyCorrect: boolean) => {
        event.stopPropagation(); // Ngăn không cho sự kiện lan ra ngoài (tránh trigger handleSelectAnswer)
        
        if (onAnswerChange) {
            // Nếu câu trả lời hiện tại đã là đúng, không làm gì
            if (isCurrentlyCorrect) return;
            
            // Đặt tất cả các câu trả lời là không đúng
            answers.forEach(answer => {
                if (answer.id !== answerId && answer.is_correct) {
                    onAnswerChange(answer.id, { is_correct: false });
                }
            });
            
            // Đặt câu trả lời được chọn là đúng
            onAnswerChange(answerId, { is_correct: true });
        }
    };

    // Lấy biểu tượng và tên theo index
    const getSymbolAndName = (index: number) => {
        switch(index) {
            case 0: return { symbol: <TriangleIcon /> };
            case 1: return { symbol: <DiamondIcon /> };
            case 2: return { symbol: <CircleIcon /> };
            case 3: return { symbol: <SquareIcon /> };
            default: return { symbol: <CircleIcon /> };
        }
    };

    return (
        <Box className={styles.previewContainer}>
            {/* Tiêu đề câu hỏi */}
            <Box className={styles.questionTitle}>
                <Typography variant="h5" className={styles.questionText}>
                    {question.content}
                </Typography>
            </Box>

            {/* Hình ảnh */}
            <Box className={styles.imageContainer}>
                <img 
                    src={question.image_url || "https://images.unsplash.com/photo-1503756234508-e32369269deb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80"}
                    alt={question.content} 
                    className={styles.questionImage}
                />
                
                {/* Các nút công cụ */}
                <Box className={styles.imageTools}>
                    <Box className={styles.toolButton}>
                        <span className={styles.toolIcon}><InfoOutlinedIcon fontSize="small" /></span>
                    </Box>
                </Box>
            </Box>

            {/* Danh sách đáp án */}
            <Grid container spacing={2} className={styles.answersContainer}>
                {answers.map((answer, index) => {
                    const { symbol } = getSymbolAndName(index);
                    const isCorrect = answer.is_correct;
                    
                    // Xác định className dựa trên index
                    const answerClass = [
                        styles.answerRed,
                        styles.answerBlue,
                        styles.answerYellow,
                        styles.answerGreen
                    ][index % 4];
                    
                    return (
                        <Grid size={6} key={answer.id || index}>
                            <Box 
                                className={`${styles.answerCard} ${answerClass}`}
                                onClick={() => handleSelectAnswer(answer.id)}
                            >
                                <Box className={styles.symbolContainer}>
                                    <Typography className={styles.symbolText}>
                                        {symbol}
                                    </Typography>
                                </Box>
                                
                                <Typography className={styles.answerText}>
                                    {answer.content}
                                </Typography>
                                
                                {/* Checkbox tròn cho mỗi đáp án */}
                                <Box 
                                    className={styles.checkboxContainer}
                                    onClick={(e) => handleToggleCorrect(e, answer.id, isCorrect)}
                                    sx={{
                                        backgroundColor: isCorrect ? '#4caf50' : 'rgba(255,255,255,0.3)',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 1,
                                        border: '2px solid white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 0 0 3px rgba(255,255,255,0.5)',
                                            backgroundColor: isCorrect ? '#43a047' : 'rgba(255,255,255,0.4)'
                                        }
                                    }}
                                >
                                    {isCorrect ? (
                                        <CheckCircleIcon sx={{ color: 'white', fontSize: '20px' }} />
                                    ) : (
                                        <RadioButtonUncheckedIcon sx={{ color: 'white', fontSize: '20px' }} />
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Nút thêm đáp án */}
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAnswerCreate}
                className={styles.addAnswerButton}
            >
                Thêm đáp án
            </Button>
        </Box>
    );
};

export default QuestionPreview;