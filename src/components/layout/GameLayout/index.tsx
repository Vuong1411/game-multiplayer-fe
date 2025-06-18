import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';

interface GameLayoutProps {
    children: React.ReactNode;
}

const GameLayout = ({ children }: GameLayoutProps) => {

    return (
        <Box className={styles.container}>
            <Box className={styles.contentWrapper}>
                <Box component="main" className={styles.mainContent}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default GameLayout;