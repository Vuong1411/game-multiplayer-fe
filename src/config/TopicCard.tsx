import { Card, CardContent, Typography, Box } from '@mui/material';

export interface TopicCardProps {
    title: string;
    description: string;
    image: string;
    color: string;
    onClick?: () => void;
}

const TopicCard = ({ title, description, image, color, onClick }: TopicCardProps) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                minWidth: 200,
                maxWidth: 200,
                height: 320,
                backgroundColor: color,
                color: 'white',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'inline-block',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <Box
                sx={{
                    height: 220,
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                <Box
                    component="img"
                    src={image}
                    alt={title}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </Box>
            <CardContent
                sx={{
                    height: 100,
                    padding: '12px !important',
                    display: 'flex',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            mb: 0.5
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.75rem',
                            lineHeight: 1.3
                        }}
                    >
                        {description}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TopicCard;