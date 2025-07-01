// Cập nhật phần import
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, 
  CircularProgress, Link, Alert, AlertTitle
} from '@mui/material';
import { authService } from '@project/services/auth.service';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Kiểm tra token khi component mount
  useEffect(() => {
    if (!token) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    }
  }, [token]);

  const validatePassword = (matKhau: string) => {
    if (matKhau.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return false;
    }
    if (!/[A-Z]/.test(matKhau)) {
      setError('Mật khẩu phải chứa ít nhất 1 chữ hoa');
      return false;
    }
    if (!/[0-9]/.test(matKhau)) {
      setError('Mật khẩu phải chứa ít nhất 1 số');
      return false;
    }
    return true;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) return;

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token || '', password);
      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const errorMessage = err.message || 'Đặt lại mật khẩu thất bại';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="success">
            <AlertTitle>Thành công</AlertTitle>
            Đặt lại mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập...
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ 
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Đặt lại mật khẩu
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleReset} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu mới"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Đặt lại mật khẩu'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/login" variant="body2">
              Quay lại đăng nhập
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;