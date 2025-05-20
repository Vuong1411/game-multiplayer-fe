import {
    Box,
    Typography,
    ListItemButton,
    Card,
    Grid,
} from "@mui/material";
import { 
    AddPhotoAlternate as AddIcon,
    FiberManualRecord as DotIcon
} from "@mui/icons-material";
// @project
import styles from './styles.module.scss';
import { Question, Answer } from '../../../types/question';


export interface ReviewCardProps {
    question: Question;
    answers?: Answer[];
    isSelected?: boolean;
    onClick: () => void;
}

const ReviewCard = ({ question, answers = [], isSelected = false, onClick }: ReviewCardProps) => {

    // Hiển thị hình ảnh thu nhỏ nếu câu hỏi có hình
    const hasImage = Boolean(question.image_url);

    return (
        <Card
            elevation={isSelected ? 2 : 0}
            className={styles.card + (isSelected ? ` ${styles.cardSelected}` : '')}
            
        >
            <ListItemButton
                selected={isSelected}
                onClick={onClick}
                disableRipple
                className={styles.listItemButton}
            >

                {/* Nội dung chính */}
                <Box className={styles.cardContent}>
                    {/* Nội dung câu hỏi */}
                    <Typography
                        variant="body2"
                        className={styles.questionContent + (isSelected ? ` ${styles.questionContentSelected}` : '')}
                        noWrap
                    >
                        {question.content}
                    </Typography>

                    {/* Thời gian và hình ảnh */}
                    <Box className={styles.timeImageContainer}>
                        {/* Vòng tròn thời gian */}
                        <Box className={styles.timeCircle}>
                            <Typography variant="caption" className={styles.timeText}>
                                {question.time_limit}
                            </Typography>
                        </Box>

                        {/* Ảnh thu nhỏ */}
                        {hasImage ? (
                            <Box
                                component="img"
                                src={question.image_url}
                                alt={question.content}
                                className={styles.thumbnailImage}
                            />
                        ) : (
                            <Box className={styles.imagePlaceholder}>
                                <AddIcon className={styles.placeholderIcon} />
                            </Box>
                        )}
                    </Box>

                    {/* Các icon đại diện cho các lựa chọn trắc nghiệm */}
                    <Grid container spacing={0.5}>
                        {/* Hiển thị 4 icon text field đại diện cho các lựa chọn */}
                        {answers.map((answer, index) => (
                            <Grid 
                                size={answers.length === 1 ? 12 : 6 }
                                key={index}
                                className={styles.answerGridItem}
                            >
                                <Box className={styles.answerItem + (answers.length === 1 ? ` ${styles.answerItemSingle}` : ` ${styles.answerItemMultiple}`)} />
                                {/* Chấm xanh chỉ hiển thị ở đáp án đúng */}
                                {answer.is_correct && (
                                    <DotIcon className={styles.dotIcon} />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </ListItemButton>
        </Card>
    );
};

export default ReviewCard;