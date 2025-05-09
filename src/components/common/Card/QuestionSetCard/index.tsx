import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    Chip,
    CardMedia,
    CardContent,
    Typography,
    Menu,
    IconButton,
    MenuItem
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
// @project
import styles from './styles.module.scss';
import { QuestionSet } from '../../../../types/question';

export interface QuestionSetCardProps {
    quiz: QuestionSet;
    color: string;
    onClick?: (id: string) => void;
}

const QuestionSetCard = ({ quiz, color, onClick }: QuestionSetCardProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Card
            onClick={() => onClick?.(quiz.id)}
            className={styles.card}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
            sx={{
                '&.MuiCard-root': {
                    backgroundColor: color
                }
            }}
        >
            <Box className={styles.chipContainer}>
                <Chip
                    label="Kahoot"
                    size="small"
                    className={`${styles.chip} ${styles.kahoot}`}
                />
                <Chip
                    label="Miễn phí"
                    size="small"
                    className={`${styles.chip} ${styles.free}`}
                />
            </Box>
            <Box className={styles.mediaWrapper}>
                <CardMedia
                    component="img"
                    image={quiz.image}
                    alt={quiz.title}
                    className={styles.media}
                />
                <Box className={styles.questionsCount}>
                    {quiz.questions} Câu hỏi
                </Box>
            </Box>
            <CardContent className={styles.content}>
                <Box className={styles.titleContainer}>
                    <Typography className={styles.title}>
                        {quiz.title}
                    </Typography>
                    {showMenu && (
                        <IconButton
                            onClick={handleOpenMenu}
                            className={styles.menuButton}
                            size="small"
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                <Typography className={styles.author}>
                    {quiz.author}
                </Typography>
            </CardContent>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                onClick={(e) => e.stopPropagation()}
            >
                <MenuItem onClick={() => navigate('/edit')}>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={() => navigate('/delete')}>
                    Xóa
                </MenuItem>
            </Menu>
        </Card>
    );
};

export default QuestionSetCard;