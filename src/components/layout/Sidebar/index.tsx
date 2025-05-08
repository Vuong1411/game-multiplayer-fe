import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
} from '@mui/material';
import {
    Home,
    Explore,
    LibraryBooks,
    Assessment,
    Group,
    Help,
    Settings
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
// @project
import styles from './styles.module.scss';

const menuItems = [
    {
        text: 'Trang chủ',
        icon: <Home />,
        path: '/'
    },
    {
        text: 'Khám phá',
        icon: <Explore />,
        path: '/discover'
    },
    {
        text: 'Thư viện',
        icon: <LibraryBooks />,
        path: '/library'
    },
    {
        text: 'Báo cáo',
        icon: <Assessment />,
        path: '/reports'
    },
    {
        text: 'Nhóm',
        icon: <Group />,
        path: '/groups'
    },
];

const bottomMenuItems = [
    {
        text: 'Trợ giúp',
        icon: <Help />,
        path: '/help'
    },
    {
        text: 'Cài đặt',
        icon: <Settings />,
        path: '/settings'
    }
];

const DrawerContent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Box className={styles.drawerContent}>
            
            {/* Top menu items */}
            <List className={styles.topList}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} className={styles.listItem}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            className={styles.listItemButton}
                        >
                            <ListItemIcon className={styles.listItemIcon}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} className={styles.listItemText} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            {/* Bottom menu items */}
            <List>
                {bottomMenuItems.map((item) => (
                    <ListItem key={item.text} className={styles.listItem}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon className={styles.listItemIcon}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} className={styles.listItemText} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

interface SidebarProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

const Sidebar = ({ mobileOpen, handleDrawerToggle }: SidebarProps) => {
    return (
        <Box className={styles.drawerContainer}>
            {/* Temporary drawer for mobile view */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                className={styles.temporaryDrawer}
            >
                <DrawerContent />
            </Drawer>

            {/* Permanent drawer for desktop view */}
            <Drawer
                variant="permanent"
                className={styles.permanentDrawer}
                open
            >
                <DrawerContent />
            </Drawer>
        </Box>
    );
};

export default Sidebar;