import { Card, CardContent, Typography, Box } from '@mui/material';
// @project
import styles from './styles.module.scss';

export interface TopicCardProps {
    title: string;
    description: string;
    image: string;
    color?: string;
    onClick?: () => void;
}

const TopicCard = ({ title, description, image, color, onClick }: TopicCardProps) => {
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
            <Box className={styles.imageContainer}>
                <Box
                    component="img"
                    src={image}
                    alt={title}
                    className={styles.image}
                />
            </Box>
            <CardContent className={styles.content}>
                <Box className={styles.contentWrapper}>
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

export default TopicCard;