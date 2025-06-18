import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';
// @project
import styles from './styles.module.scss';
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

    const from = (location.state as any)?.from?.pathname || '/';

    // Xử lý khi người dùng đã đăng nhập
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
                // Lưu thông tin người dùng và token vào context
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
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
