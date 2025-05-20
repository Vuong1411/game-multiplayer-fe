import {
    Box,
    Button,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

// @project
import ReviewCard from '../ReviewCard';
import { Question, Answer } from '../../../types/question';
import styles from './styles.module.scss';

export interface SidebarProps {
    questions: Question[];
    answers?: Answer[];
    selectedQuestionId?: number;
    onSelectQuestion: (questionId: number) => void;
    onAddQuestion?: () => void;
    onAddSlide?: () => void;
}

const Sidebar = ({
    questions,
    answers = [],
    selectedQuestionId,
    onSelectQuestion,
    onAddQuestion,
    onAddSlide,
}: SidebarProps) => {

    // Thêm hàm helper để lọc answers
    const getAnswersForQuestion = (questionId: number): Answer[] => {
        return answers.filter(answer => answer.question_id === questionId);
    };

    return (
        <Box className={styles.sidebar}>
            {/* Phần danh sách câu hỏi (có thể cuộn) */}
            <Box className={styles.questionList}>
                {questions.map((question, index) => (
                    <Box key={question.id} className={styles.questionItem}>
                        <Typography 
                            variant="body2" 
                            className={styles.questionTypeLabel} 
                            noWrap
                        >
                            {index + 1}. {question.type === 'choice' ? "Trắc nghiệm" : "Nhập đáp án"}
                        </Typography>
                        <ReviewCard
                            key={question.id}
                            question={question}
                            answers={getAnswersForQuestion(question.id)}
                            isSelected={selectedQuestionId === question.id}
                            onClick={() => onSelectQuestion(question.id)}
                        />
                    </Box>
                ))}
            </Box>

            {/* Tách phần buttons ra khỏi phần cuộn */}
            <Box className={styles.buttonsContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={onAddQuestion}
                    sx={{ textTransform: 'none' }}
                >
                    Thêm câu hỏi
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ViewCarouselIcon />}
                    onClick={onAddSlide}
                    sx={{ textTransform: 'none' }}
                >
                    Thêm slide
                </Button>
            </Box>
        </Box>
    );
};

export default Sidebar;