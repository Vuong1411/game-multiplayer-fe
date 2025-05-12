import { Card, CardContent, Typography, Box } from '@mui/material';
import styles from './styles.module.scss';

export interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color?: string;
    onClick?: () => void;
}

const FeatureCard = ({ title, description, icon, color, onClick }: FeatureCardProps) => {
    return (
        <Card 
            onClick={onClick}
            className={styles.card}
            sx={{ 
                '&.MuiCard-root': {
                    backgroundColor: color
                }
            }}
        >
            <CardContent className={styles.cardContent}>
                <Box className={styles.contentWrapper}>
                    {icon}
                    <Typography
                        variant="h6"
                        component="h3"
                        className={styles.title}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        className={styles.description}
                    >
                        {description}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FeatureCard;