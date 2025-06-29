import { useState } from 'react';
  import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
  import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    CircularProgress,
    Link,
  } from '@mui/material';
  import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

  // @project
  import { User } from '@project/types/user';
  import { useAuth } from '@project/contexts/AuthContext';
  import { authService } from '@project/services/auth.service';

  const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authContext = useAuth();

    const [user, setUser] = useState<Partial<User>>({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = (location.state)?.from?.pathname || '/';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUser({
        ...user,
        [event.target.name]: event.target.value,
      });
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setError('');
      setLoading(true);

      if (!user.email || !user.password) {
        setError('Vui lòng nhập email và mật khẩu.');
        setLoading(false);
        return;
      }

      try {
        const response = await authService.login(user.email as string, user.password as string);
        if (response) {
          const { user, token } = response;
          authContext.login(user, token);
          navigate(from, { replace: true });
        } else {
          setError('Sai tài khoản hoặc mật khẩu.');
        }
      } catch (err: any) {
        console.error('Login request failed:', err);
        setError(err.message || 'Không thể đăng nhập. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
      try {
        const credential = credentialResponse.credential;
        if (!credential) throw new Error('Không nhận được Google Credential');
        
        const result = await authService.googleLogin(credential);
        if (result) {
          const { user, token } = result;
          authContext.login(user, token);
          navigate(from, { replace: true });
        }
      } catch (err: any) {
        console.error('Google login failed:', err);
        setError(err.message || 'Đăng nhập bằng Google thất bại');
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
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={user.email}
              onChange={handleChange}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password}
              onChange={handleChange}
              error={!!error}
            />
            {/* Link "Quên mật khẩu?" */}
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Quên mật khẩu?
              </Link>
            </Box>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
            </Button>

            {/* Google Login */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => setError('Google Login thất bại')}
              />
            </Box>
            
            {/*Dẫn tới trang đăng ký */}
             <Box sx={{ mt: 2, textAlign: 'center' }}>
               <Typography variant="body2">
                  Bạn chưa có tài khoản?{' '}
               <Link component={RouterLink} to="/register" variant="body2">
                  Đăng ký ngay
               </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    );
  };

  export default Login;
