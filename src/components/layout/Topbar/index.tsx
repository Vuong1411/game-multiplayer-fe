import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    InputBase,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Create as CreateIcon,
    Search as SearchIcon,
    Person,
    Login,
    PersonAdd,
    Logout,
    Settings,
} from '@mui/icons-material';
// @project
import styles from './styles.module.scss';
import logo from '../../../assets/logo.png';

interface TopbarProps {
    handleDrawerToggle: () => void;
}

const Topbar = ({ handleDrawerToggle }: TopbarProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const isAuthenticated = false;

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar 
            position="fixed" 
            className={styles.appBar}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar className={styles.toolbar}>

                {/* Left section */}
                <Box className={styles.leftSection}>

                    {/* Hamburger menu icon */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={styles.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo */}
                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        className={styles.logo}
                        onClick={() => navigate('/')}
                    />

                    {/* Search bar */}
                    <Box className={styles.searchWrapper}>
                        <Box className={styles.searchBox}>
                            <Box className={styles.searchIconWrapper}>
                                <SearchIcon />
                            </Box>
                            <InputBase
                                className={styles.searchInput}
                                placeholder="Tìm kiếm..."
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Right section */}
                <Box className={styles.rightSection}>

                    {/* Create button */}
                    <Button
                        variant="contained"
                        startIcon={<CreateIcon />}
                        className={styles.createButton}
                        onClick={() => navigate('/create')}
                    >
                        Tạo
                    </Button>

                    {/* Profile menu */}
                    <IconButton onClick={handleOpenMenu}>
                        <Avatar className={styles.avatar} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        PaperProps={{
                            className: styles.menu
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {isAuthenticated ? (
                            <>
                                <MenuItem onClick={() => navigate('/profile')}>
                                    <ListItemIcon>
                                        <Person fontSize="small" />
                                    </ListItemIcon>
                                    Hồ sơ cá nhân
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/settings')}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Cài đặt
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={() => navigate('/logout')}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Đăng xuất
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={() => navigate('/login')}>
                                    <ListItemIcon>
                                        <Login fontSize="small" />
                                    </ListItemIcon>
                                    Đăng nhập
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/register')}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    Đăng ký
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;