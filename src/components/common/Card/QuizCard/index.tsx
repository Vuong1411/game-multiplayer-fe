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
    MenuItem,
    ListItemIcon
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    PlayArrow as PlayArrowIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
// @project
import styles from './styles.module.scss';
import { QuestionSet } from '../../../../types/question';

export interface QuizCardProps {
    quiz: QuestionSet;
    color?: string;
    onClick?: (id: number) => void;
}

const QuizCard = ({ quiz, color, onClick }: QuizCardProps) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showMenu, setShowMenu] = useState(false);

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setShowMenu(false);
    };

    return (
        <Card
            onClick={() => onClick?.(quiz.id)}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => !anchorEl && setShowMenu(false)}
            className={styles.card}
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
                    image={quiz.image_url}
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
                    <IconButton
                        onClick={handleOpenMenu}
                        className={styles.menuButton}
                        size="small"
                        sx={{
                            opacity: showMenu ? 1 : 0,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
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
                className={styles.menu}
            >
                <MenuItem onClick={() => navigate('/live')} className={styles.menuItem}>
                    <ListItemIcon>
                        <PlayArrowIcon fontSize="small" />
                    </ListItemIcon>
                    Tổ chức live
                </MenuItem>
                <MenuItem onClick={() => navigate('/edit')} className={styles.menuItem}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={() => navigate('/delete')} className={`${styles.menuItem} ${styles.delete}`}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    Xóa
                </MenuItem>
            </Menu>
        </Card>
    );
};

export default QuizCard;