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
    Dashboard,
    School,
    LibraryBooks,
    Assessment,
    Group,
    Collections,
    Settings
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const menuItems = [
    {
        text: 'Bảng điều khiển',
        icon: <Dashboard />,
        path: '/dashboard'
    },
    {
        text: 'Quiz của tôi',
        icon: <School />,
        path: '/my-quizzes'
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
    }
];

const bottomMenuItems = [
    {
        text: 'Nhóm',
        icon: <Group />,
        path: '/groups'
    },
    {
        text: 'Thư viện ảnh',
        icon: <Collections />,
        path: '/media'
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
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Top menu items */}
            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            {/* Bottom menu items */}
            <List>
                {bottomMenuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                            />
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
        <Box sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
            {/* Temporary drawer for mobile view */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        backgroundColor: 'white',
                        height: '100%',
                        borderRight: '1px solid #e0e0e0',
                    },
                }}
            >
                <DrawerContent />
            </Drawer>

            {/* Permanent drawer for desktop view */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        backgroundColor: 'white',
                        mt: '64px',
                        height: 'calc(100% - 64px)',
                        borderRight: '1px solid #e0e0e0'
                    },
                }}
                open
            >
                <DrawerContent />
            </Drawer>
        </Box>
    );
};

export default Sidebar;