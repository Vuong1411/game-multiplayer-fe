import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
// @project
import styles from './styles.module.scss';

interface PlusCardProps {
    onClick?: () => void;
}

const PlusCard = ({ onClick }: PlusCardProps) => {
    return (
        <Box
            onClick={onClick}
            className={styles.plusCard}
        >
            <Add className={styles.plusIcon} />
        </Box>
    );
};

export default PlusCard;