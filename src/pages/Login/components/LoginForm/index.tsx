import { useState } from 'react';
import { User } from '@project/types/user';

const LoginForm = () => {
    const [user, setUser] = useState<Partial<User>>({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Sai tài khoản hoặc mật khẩu');
            }

            const data = await response.json();
            console.log('Login thành công:', data);

            // TODO: dispatch Redux hoặc lưu token
        } catch (err) {
            console.error('Login request failed:', err);
            setError('Không thể đăng nhập. Vui lòng kiểm tra lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Đăng nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Mật khẩu:</label>
                <input
                    type="password"
                    id="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Bạn chưa có tài khoản?{' '}
                <a href="/register">Đăng ký ngay</a>
            </p>
        </form>
    );
};

export default LoginForm;
