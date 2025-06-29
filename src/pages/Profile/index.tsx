import { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Grid, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import QuizList from '../Library/components/QuizList';
import ImageUploadCard from '../Creator/components/ImageUploadCard';
import { useAuth } from '@project/contexts/AuthContext';
import { questionSetService } from '@project/services'; 
import { userService } from '@project/services/user.service';
import { QuestionSet } from '@project/types/question';
import MainLayout from '@project/components/layout/MainLayout';

const Profile = () => {
  const { currentUser } = useAuth();
  const [myQuiz, setMyQuiz] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  // State cho đổi mật khẩu
  const [openPwd, setOpenPwd] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{type: 'success'|'error', text: string}|null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleAvatarChange = (url: string | undefined, file?: File | undefined) => {
    setAvatar(url || '');
    // Gọi API upload avatar nếu có
  };

  const handleSave = async () => {
    // Gọi API cập nhật thông tin user (username, avatar)
    if (!currentUser) return;
    // Giả sử chỉ cho đổi username
    await userService.updateProfile({ userId: currentUser.id, username });
    setEditMode(false);
  };

  // Đổi mật khẩu
  const handleChangePassword = async () => {
    setPwdLoading(true);
    setPwdMsg(null);
    const ok = await userService.changePassword(oldPassword, newPassword);
    if (ok) {
      setPwdMsg({type: 'success', text: 'Đổi mật khẩu thành công!'});
      setOldPassword('');
      setNewPassword('');
    } else {
      setPwdMsg({type: 'error', text: 'Đổi mật khẩu thất bại!'});
    }
    setPwdLoading(false);
  };

  if (!currentUser) return <Typography>Vui lòng đăng nhập để xem hồ sơ cá nhân.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar src={avatar} sx={{ width: 80, height: 80 }} />
        <Box>
          {editMode ? (
            <>
              <TextField
                label="Tên người dùng"
                value={username}
                onChange={e => setUsername(e.target.value)}
                size="small"
                sx={{ mb: 1 }}
              />
              <ImageUploadCard imageUrl={avatar} onChange={handleAvatarChange} />
              <Button variant="contained" onClick={handleSave} sx={{ mt: 1 }}>Lưu</Button>
            </>
          ) : (
            <>
              <Typography variant="h5">{currentUser.username}</Typography>
              <Typography variant="body2">{currentUser.email}</Typography>
              <Typography variant="body2">Vai trò: {currentUser.role}</Typography>
              <Button variant="outlined" size="small" onClick={() => setEditMode(true)} sx={{ mt: 1, mr: 1 }}>Chỉnh sửa</Button>
              <Button variant="outlined" size="small" color="secondary" onClick={() => setOpenPwd(true)} sx={{ mt: 1 }}>Đổi mật khẩu</Button>
            </>
          )}
        </Box>
      </Box>

      {/* Dialog đổi mật khẩu */}
      <Dialog open={openPwd} onClose={() => setOpenPwd(false)}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          {pwdMsg && <Alert severity={pwdMsg.type} sx={{ mb: 2 }}>{pwdMsg.text}</Alert>}
          <TextField
            label="Mật khẩu cũ"
            type={showOldPwd ? 'text' : 'password'}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
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

      {/* Thành tích */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Thành tích</Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h4">{myQuiz.length}</Typography>
              <Typography>Bộ quiz đã tạo</Typography>
            </Box>
          </Grid>
          {/* Có thể thêm các thành tích khác như điểm, badge, ... */}
        </Grid>
      </Box>

      {/* Quiz đã tạo */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Bộ quiz của tôi</Typography>
        {loading ? <CircularProgress /> : <QuizList questionSets={myQuiz} />}
      </Box>
    </Box>
  );
};

const ProfilePage = () => (
  <MainLayout>
    <Profile />
  </MainLayout>
);

export default ProfilePage;
