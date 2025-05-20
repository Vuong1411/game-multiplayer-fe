import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField
} from '@mui/material';
import ChangeHistorySharpIcon from '@mui/icons-material/ChangeHistorySharp'; // hình tam giác
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar'; // 
import HexagonIcon from '@mui/icons-material/Hexagon'; // hình lục giác
import PentagonIcon from '@mui/icons-material/Pentagon'; // hình ngũ giác
import CircleIcon from '@mui/icons-material/Circle'; // hình tròn
import SquareIcon from '@mui/icons-material/Square'; // hình vuông
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ClearIcon from '@mui/icons-material/Clear';
// @project
import { Question, Answer } from '../../../types/question';
import styles from './styles.module.scss';
import ImageUploadCard from '../ImageUploadCard';

interface QuestionPreviewProps {
    question: Question;
    answers: Answer[];
    onAnswerCreate?: () => void;
    onSelectedAnswer?: (answerId: number) => void;
    onQuestionChange?: (newQuestion: Question) => void;
    onAnswerChange?: (answerId: number, newAnswer: Partial<Answer>) => void;
    onAnswerDelete?: (answerId: number) => void;
}

const QuestionPreview = ({
    question,
    answers,
    onAnswerCreate,
    onQuestionChange,
    onAnswerChange,
    onAnswerDelete
}: QuestionPreviewProps) => {

    // Hàm xử lý chọn đáp án đúng
    const handleToggleCorrect = (event: React.MouseEvent, answerId: number) => {
        event.stopPropagation();
        // Tìm đáp án được click
        const clickedAnswer = answers.find(answer => answer.id === answerId);

        if (!clickedAnswer) return;

        onAnswerChange?.(answerId, {
            is_correct: !clickedAnswer.is_correct
        });
    };

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

    return (
        <Box className={styles.previewContainer}>
            {/* Tiêu đề câu hỏi */}
            <Box className={styles.questionTitle}>
                <TextField
                    value={question.content}
                    onChange={(e) => onQuestionChange?.({ ...question, content: e.target.value })}
                    className={styles.questionTextField}
                    fullWidth
                    multiline
                    variant="standard"
                    InputProps={{
                        className: styles.questionInput,
                        disableUnderline: true,
                    }}
                    inputProps={{
                        style: { textAlign: 'center' }
                    }}
                    placeholder="Nhập câu hỏi của bạn"
                />
            </Box>

            {/* Hình ảnh */}
            <ImageUploadCard
                imageUrl = {question.image_url}
                alt={question.content}
                onImageChange={(url) => {
                    onQuestionChange?.({ ...question, image_url: url });
                }}
            />

            {/* Danh sách đáp án trắc nghiệm */}
            <Grid container justifyContent="center" spacing={2} className={styles.answersContainer}>
                {answers.map((answer, index) => {
                    const { symbol } = getSymbol(index);
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

                    if (question.type === 'choice') return (
                        <Grid size={6} key={answer.id}>
                            <Box className={`${styles.answerCard} ${answerClass}`}>
                                <Box className={styles.symbolContainer}>
                                    <Typography className={styles.symbolText}>
                                        {symbol}
                                    </Typography>
                                </Box>

                                {/* TextField cho nội dung đáp án */}
                                <TextField
                                    value={answer.content}
                                    onChange={(e) => onAnswerChange?.(answer.id, { content: e.target.value })}
                                    className={styles.answerTextField}
                                    inputProps={{
                                        className: styles.answerInput
                                    }}
                                    placeholder={`Thêm đáp án ${index + 1}`}
                                />

                                {/* Checkbox tròn cho mỗi đáp án */}
                                <Box
                                    className={`${styles.checkboxContainer} ${isCorrect ? styles.checkboxCorrect : ''}`}
                                    onClick={(e) => handleToggleCorrect(e, answer.id)}
                                >
                                    {isCorrect ? (
                                        <CheckCircleIcon className={styles.checkIcon} />
                                    ) : (
                                        <RadioButtonUncheckedIcon className={styles.uncheckIcon} />
                                    )}
                                </Box>

                                {/* Nút xóa đáp án */}
                                {answers.length > 2 && ( // Only show when there are more than 2 answers
                                    <Box
                                        className={styles.deleteAnswerButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAnswerDelete?.(answer.id);
                                        }}
                                    >
                                        <ClearIcon className={styles.clearIcon} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    );
                    else return (
                        <Grid size={8} key={answer.id}>
                            <Box
                                className={`${styles.answerCard} ${answerClass}`}
                            >
                                {/* Biểu tượng cho mỗi đáp án */}
                                <Box className={styles.symbolContainer}>
                                    <Typography className={styles.symbolText}>
                                        {symbol}
                                    </Typography>
                                </Box>

                                {/* TextField cho nội dung đáp án */}
                                <TextField
                                    value={answer.content}
                                    onChange={(e) => onAnswerChange?.(answer.id, { content: e.target.value, is_correct: true })}
                                    className={styles.answerTextField}
                                    inputProps={{
                                        className: styles.answerInput
                                    }}
                                    placeholder={`Nhập đáp án ${index + 1}`}
                                />

                                {/* Nút xóa đáp án */}
                                {answers.length > 1 && (
                                    <Box
                                        className={styles.deleteAnswerButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAnswerDelete?.(answer.id);
                                        }}
                                    >
                                        <ClearIcon className={styles.clearIcon} />
                                    </Box>
                                )}
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