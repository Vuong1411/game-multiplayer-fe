import { useState } from 'react';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box className={styles.container}>
            <Topbar handleDrawerToggle={handleDrawerToggle} />

            <Box className={styles.contentWrapper}>
                <Sidebar
                    mobileOpen={mobileOpen}
                    handleDrawerToggle={handleDrawerToggle}
                />

                <Box component="main" className={styles.mainContent}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;