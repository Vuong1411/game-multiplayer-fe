import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// @project
import styles from './styles.module.scss';
import { authService } from '@project/services/auth.service';

type RegisterFormData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Register = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value,
        });
    };

    const validateForm = () => {
        if (!user.username || !user.email || !user.password || !user.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return false;
        }

        if (user.password !== user.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return false;
        }

        if (user.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = user;
            const response = await authService.register(registerData as any);

            if (response) {
                // Redirect to login page after successful registration
                navigate('/login', {
                    state: {
                        message: 'Đăng ký thành công! Vui lòng đăng nhập.'
                    }
                });
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className={styles.container}>
            <Box className={styles.paper}>
                <Typography component="h1" variant="h5">
                    Đăng ký tài khoản
                </Typography>

                {error && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tên đăng nhập"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={user.username}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Địa chỉ Email"
                        name="email"
                        autoComplete="email"
                        value={user.email}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={user.password}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        id="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={styles.submit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Đăng ký'}
                    </Button>
                    <Box mt={2} textAlign="center">
                        <MuiLink component={RouterLink} to="/login" variant="body2">
                            Đã có tài khoản? Đăng nhập ngay
                        </MuiLink>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
