import { useEffect, useState } from 'react';
import {
    Box, Typography, Avatar, Button, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, IconButton, InputAdornment, Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, Edit as EditIcon } from '@mui/icons-material';
import QuizList from '../Library/components/QuizList';
import ImageUploadCard from '../Creator/components/ImageUploadCard';
import { useAuth } from '@project/contexts/AuthContext';
import { questionSetService } from '@project/services';
import { userService } from '@project/services/user.service';
import { QuestionSet } from '@project/types/question';
import MainLayout from '@project/components/layout/MainLayout';

const Profile = () => {
    const { currentUser, reloadUser } = useAuth();
    const [myQuiz, setMyQuiz] = useState<QuestionSet[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit profile modal
    const [editMode, setEditMode] = useState(false);
    const [avatar, setAvatar] = useState(currentUser?.avatar_url || '');
    const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
    const [username, setUsername] = useState(currentUser?.username || '');

    // Change password modal
    const [openPwd, setOpenPwd] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [pwdLoading, setPwdLoading] = useState(false);
    const [showOldPwd, setShowOldPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);

    // Notification
    const [notification, setNotification] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'warning' | 'info' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        setAvatar(currentUser?.avatar_url || '');
        setUsername(currentUser?.username || '');
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) {
            setMyQuiz([]);
            return;
        }

        setLoading(true);
        const fetchQuiz = async () => {
            try {
                const data = await questionSetService.getMe();
                setMyQuiz(data);
            } catch {
                setMyQuiz([]);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [currentUser]);

    const handleAvatarChange = (url: string | undefined, file?: File | undefined) => {
        setAvatar(url || '');
        setAvatarFile(file);
    };

    const handleSave = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            setEditMode(false);
            await userService.updateProfile({ username, avatarFile });
            await reloadUser();
            setNotification({ open: true, message: 'Cập nhật thông tin thành công!', severity: 'success' });
        } catch {
            setNotification({ open: true, message: 'Cập nhật thông tin thất bại!', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Đổi mật khẩu
    const handleChangePassword = async () => {
        setPwdLoading(true);
        setPwdMsg(null);
        const ok = await userService.changePassword(oldPassword, newPassword);
        if (ok) {
            setPwdMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            setOldPassword('');
            setNewPassword('');
        } else {
            setPwdMsg({ type: 'error', text: 'Đổi mật khẩu thất bại!' });
        }
        setPwdLoading(false);
    };

    const handleCloseNotification = () => setNotification(prev => ({ ...prev, open: false }));

    if (!currentUser) return <Typography align="center" sx={{ mt: 8 }}>Vui lòng đăng nhập để xem hồ sơ cá nhân.</Typography>;

    return (
        <Box sx={{ p: 2 }}>
            {/* Loading toàn trang */}
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        zIndex: 1000,
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(255,255,255,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {/* Thông báo */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3500}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <Box sx={{ p: 2, mb: 4, borderRadius: 3, bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar src={avatar} sx={{ width: 90, height: 90, border: '3px solid #1976d2' }} />
                    <Box>
                        <Typography variant="h5" fontWeight={700}>{currentUser.username}</Typography>
                        <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
                        <Typography variant="body2" color="text.secondary">Vai trò: {currentUser.role}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => setEditMode(true)}
                                sx={{ mr: 1 }}
                            >
                                Chỉnh sửa thông tin
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                onClick={() => setOpenPwd(true)}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Quiz đã tạo */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Bộ quiz của tôi</Typography>
                <QuizList questionSets={myQuiz} />
            </Box>

            {/* Modal chỉnh sửa thông tin cá nhân */}
            <Dialog open={editMode} onClose={() => setEditMode(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}>
                        <ImageUploadCard imageUrl={avatar} onChange={handleAvatarChange} />
                        <TextField
                            label="Tên người dùng"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditMode(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave}>Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog đổi mật khẩu */}
            <Dialog open={openPwd} onClose={() => setOpenPwd(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    {pwdMsg && <Alert severity={pwdMsg.type} sx={{ mb: 2 }}>{pwdMsg.text}</Alert>}
                    <TextField
                        label="Mật khẩu cũ"
                        type={showOldPwd ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        fullWidth
                        sx={{ my: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle old password visibility"
                                        onClick={() => setShowOldPwd(v => !v)}
                                        edge="end"
                                    >
                                        {showOldPwd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Mật khẩu mới"
                        type={showNewPwd ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle new password visibility"
                                        onClick={() => setShowNewPwd(v => !v)}
                                        edge="end"
                                    >
                                        {showNewPwd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPwd(false)}>Hủy</Button>
                    <Button onClick={handleChangePassword} disabled={pwdLoading} variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const ProfilePage = () => (
    <MainLayout>
        <Profile />
    </MainLayout>
);

export default ProfilePage;