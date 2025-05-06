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
    alpha,
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
import logo from '../../assets/logo.png';

interface HeaderProps {
    handleDrawerToggle: () => void;
}

const Header = ({ handleDrawerToggle }: HeaderProps) => {
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
            sx={{
                backgroundColor: 'white',
                color: 'text.primary',
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backdropFilter: 'blur(6px)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ height: 64, justifyContent: 'space-between' }}>
                {/* Left section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{ height: 32, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />

                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '400px',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                backgroundColor: (theme) => alpha(theme.palette.common.black, 0.04),
                                borderRadius: 1,
                                width: '100%',
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.common.black, 0.08),
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    padding: '0 12px',
                                    height: '100%',
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </Box>
                            <InputBase
                                placeholder="Tìm kiếm..."
                                sx={{
                                    color: 'inherit',
                                    width: '100%',
                                    '& .MuiInputBase-input': {
                                        padding: '8px 8px 8px 40px',
                                        width: '100%',
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Right section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<CreateIcon />}
                        sx={{
                            backgroundColor: '#26890c',
                            '&:hover': { backgroundColor: '#1e6c09' },
                            textTransform: 'none',
                            display: { xs: 'none', sm: 'flex' }
                        }}
                        onClick={() => navigate('/create')}
                    >
                        Tạo
                    </Button>

                    <IconButton onClick={handleOpenMenu}>
                        <Avatar sx={{ width: 32, height: 32 }} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        PaperProps={{
                            sx: { width: 220, mt: 1.5 },
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

export default Header;