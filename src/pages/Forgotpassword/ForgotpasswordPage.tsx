import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { authService } from '@project/services/auth.service';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email.includes('@')) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setMessage('Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.');
    } catch (err: any) {
      setError(err.message || 'Không thể gửi yêu cầu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Khung trắng bao phủ toàn bộ nội dung */}
        <Box
          sx={{
            mt: 3,
            p: 3,
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
            Quên mật khẩu
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {message && (
              <Typography color="primary" variant="body2" sx={{ mt: 1 }}>
                {message}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Gửi yêu cầu'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
