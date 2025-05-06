import { Card, CardContent, Typography, Box } from '@mui/material';

export interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}

const FeatureCard = ({ title, description, icon, color, onClick }: FeatureCardProps) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                minWidth: 200,
                maxWidth: 200,
                height: 200,
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
            <CardContent
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        textAlign: 'center'
                    }}
                >
                    {icon}
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.875rem',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {description}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FeatureCard;