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
import styles from './styles.module.scss';
import ImageUploadCard from '../ImageUploadCard';
import { Question, Answer } from '@project/types/question';

interface QuestionPreviewProps {
    question: Question;
    answers: Answer[];
    onQuestionChange?: (changes: Partial<Question>) => void;
    onAnswerCreate?: () => void;
    onAnswerChange?: (id: number, changes: Partial<Answer>) => void;
    onAnswerDelete?: (id: number) => void;
    onQuestionImageChange?: (questionId: number, url: string | undefined, file?: File) => void;
}

const QuestionPreview = ({
    question,
    answers,
    onQuestionChange,
    onAnswerCreate,
    onAnswerChange,
    onAnswerDelete,
    onQuestionImageChange
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
                    onChange={(e) => onQuestionChange?.({ content: e.target.value })}
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
                onChange={(url, file) => {
                    onQuestionChange?.({ image_url: url });
                    onQuestionImageChange?.(question.id, url, file);
                }}
            />

            {/* Danh sách đáp án */}
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

                    // Trắc nghiệm (choice)
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
                    // Tự luận
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