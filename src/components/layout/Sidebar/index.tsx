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
    Help,
    Settings,
    SupervisorAccount,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
// @project
import styles from './styles.module.scss';
import { useAuth } from '@project/contexts/AuthContext';

const menuItems = [
    {
        text: 'Trang chủ',
        icon: <Home />,
        role: 'user',
        path: '/'
    },
    {
        text: 'Khám phá',
        icon: <Explore />,
        role: 'user',
        path: '/discover'
    },
    {
        text: 'Thư viện',
        icon: <LibraryBooks />,
        role: 'user',
        path: '/library'
    },
    {
        text: 'Báo cáo',
        icon: <Assessment />,
        role: 'user',
        path: '/reports'
    },
    {
        text: 'Quản lý người dùng',
        icon: <SupervisorAccount />,
        role: 'admin',
        path: '/admin/users',
    },
];

const bottomMenuItems = [
    {
        text: 'Trợ giúp',
        icon: <Help />,
        role: 'user',
        path: '/help'
    },
    {
        text: 'Cài đặt',
        icon: <Settings />,
        role: 'user',
        path: '/profile'
    }
];

const DrawerContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'admin';

    return (
        <Box className={styles.drawerContent}>

            {/* Top menu items */}
            <List className={styles.topList}>
                {menuItems.filter(item => item.role === 'user').map((item) => (
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
                {isAdmin && menuItems.filter(item => item.role === 'admin').map((item) => (
                    <ListItem key={item.text} className={styles.listItem}>
                        <ListItemButton
                            selected={location.pathname.startsWith(item.path)}
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