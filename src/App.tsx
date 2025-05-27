import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// @project
import theme from './theme';
import { MainLayout, GameLayout } from './components/layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Library from './pages/Library';
import Creator from './pages/Creator';
import Detail from './pages/Detail';
import Lobby from './pages/Lobby';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* Authetication */}
                        <Route path="/login" element={<Login />} />

                        {/* Trang chủ */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/details/:id" element={<Detail />} />
                        </Route>

                        {/* Route Layout Game */}
                        <Route element={<GameLayout />}>
                            <Route path="/lobby/:id" element={<Lobby />} />
                        </Route>

                        {/* Các route cần đăng nhập */}
                        <Route element={<ProtectedRoute />}>

                            {/* Route Layout Main */}
                            <Route element={<MainLayout />}>
                                <Route path="/library" element={<Library />} />
                            </Route>

                            {/* Route No Layout */}
                            <Route path="/creator" element={<Creator />} />
                            <Route path="/creator/:id" element={<Creator />} />

                        </Route>

                        {/* Route không tồn tại - chuyển về home */}
                        <Route path="*" element={<Navigate to="/" replace />} />

                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
