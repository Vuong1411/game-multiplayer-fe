import { Box, Card, Chip, CardMedia, CardContent, Typography } from '@mui/material';

// Bộ câu hỏi
export interface QuizCardProps {
    id: string;
    title: string;
    author: string;
    questions: number;
    image: string;
    onClick?: (id: string) => void;
}

const QuizCard = ({ id, title, author, questions, image, onClick }: QuizCardProps) => {
    return (
        <Card
            onClick={() => onClick?.(id)}
            sx={{
                minWidth: 200,
                maxWidth: 200,
                backgroundColor: '#7c2d12',
                color: 'white',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'inline-block',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, pt: 1 }}>
                <Chip label="Kahoot" size="small" sx={{ bgcolor: '#3f0f0f', color: 'white' }} />
                <Chip label="Miễn phí" size="small" sx={{ bgcolor: '#7f1d1d', color: 'white' }} />
            </Box>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{
                        height: 120,
                        objectFit: 'cover',
                        mt: 1,
                        transition: 'transform 0.3s ease-in-out',
                        transform: 'scale(1)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        fontSize: 11,
                        bgcolor: 'rgba(0, 0, 0, 0.6)', // hoặc 'rgba(0, 0, 0, 0.5)' tùy độ mờ bạn muốn
                        color: 'white',
                        borderRadius: 2,
                        px: 0.75,
                        py: 0.2525,
                        backdropFilter: 'blur(4px)',
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {questions} Câu hỏi
                </Box>
            </Box>
            <CardContent
                sx={{
                    py: 1,
                    px: 1.5,
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    fontSize={14}
                    fontWeight="bold"
                    sx={{
                        textAlign: 'left'
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    fontSize={12}
                    sx={{
                        opacity: 0.8,
                        textAlign: 'left'
                    }}
                >
                    {author}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default QuizCard;