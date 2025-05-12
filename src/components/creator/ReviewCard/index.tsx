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
            sx={{
                width: '100%',
                height: '150px',
                mb: 1,
                borderRadius: 1,
                overflow: 'hidden',
                border: isSelected ? '2px solid #1368CE' : '1px solid #E0E0E0'
            }}
        >
            <ListItemButton
                selected={isSelected}
                onClick={onClick}
                disableRipple
                sx={{
                    padding: 0,
                    display: 'block',
                    '&.Mui-selected': {
                        bgcolor: 'transparent',
                    },
                    '&:hover': {
                        bgcolor: 'transparent',
                    },
                }}
            >

                {/* Nội dung chính */}
                <Box sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Nội dung câu hỏi */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: isSelected ? '#1368CE' : 'text.primary',
                            fontWeight: isSelected ? 'medium' : 'regular',
                            mb: 1.5,
                            pl: 0.5
                        }}
                        noWrap
                    >
                        {question.content}
                    </Typography>

                    {/* Thời gian và hình ảnh */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1.5
                    }}>
                        {/* Vòng tròn thời gian */}
                        <Box sx={{
                            width: 25,
                            height: 25,
                            borderRadius: '50%',
                            border: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'center',
                            mr: 1.5
                        }}>
                            <Typography variant="caption" sx={{ fontWeight: 'medium', color: '#555' }}>
                                {question.time_limit}
                            </Typography>
                        </Box>

                        {/* Ảnh thu nhỏ */}
                        {hasImage ? (
                            <Box
                                component="img"
                                src={question.image_url}
                                alt={question.content}
                                sx={{
                                    height: 50,
                                    width: 80,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 50,
                                    width: 80,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px dashed #ccc',
                                }}
                            >
                                <AddIcon sx={{ fontSize: 28, color: '#999' }} />
                            </Box>
                        )}
                    </Box>

                    {/* Các icon đại diện cho các lựa chọn trắc nghiệm */}
                    <Grid container spacing={1} sx={{ width: '100%', mt: 0.5, mb: 1.5, px: 1 }}>
                        {/* Hiển thị 4 icon text field đại diện cho các lựa chọn */}
                        {answers.map((answer, index) => (
                            <Grid size={answers.length === 1 ? 12 : 6 }
                                key={index}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: answers.length === 1 ? 1 : 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: answers.length === 1 ? 140 : 70,
                                        height: answers.length === 1 ? 12 : 10,
                                        backgroundColor: '#f0f0f0',
                                        border: '1px solid #d0d0d0',
                                        borderRadius: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                                {/* Chấm xanh chỉ hiển thị ở đáp án đúng */}
                                {answer.is_correct && (
                                    <DotIcon
                                        sx={{
                                            color: '#4CAF50',
                                            fontSize: 8,
                                            position: 'absolute',
                                            right: '5%',
                                        }}
                                    />
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