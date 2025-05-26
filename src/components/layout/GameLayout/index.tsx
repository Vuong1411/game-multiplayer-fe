import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
// @project
import styles from './styles.module.scss';

const GameLayout = () => {

    return (
        <Box className={styles.container}>
            <Box className={styles.contentWrapper}>
                <Box component="main" className={styles.mainContent}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default GameLayout;