import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import QuizIcon from '@mui/icons-material/Quiz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// Nếu dùng chart: npm install recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalQuizzes: 0,
        totalPlays: 0,
        playStats: [] as { date: string; count: number }[],
    });

    useEffect(() => {
        // Giả lập fetch API, thay bằng gọi API thật của bạn
        const fetchStats = async () => {
            setLoading(true);
            // Ví dụ: const res = await adminService.getDashboardStats();
            setTimeout(() => {
                setStats({
                    totalUsers: 1234,
                    totalQuizzes: 321,
                    totalPlays: 4567,
                    playStats: [
                        { date: '2024-06-25', count: 120 },
                        { date: '2024-06-26', count: 150 },
                        { date: '2024-06-27', count: 180 },
                        { date: '2024-06-28', count: 90 },
                        { date: '2024-06-29', count: 200 },
                        { date: '2024-06-30', count: 170 },
                        { date: '2024-07-01', count: 210 },
                    ],
                });
                setLoading(false);
            }, 800);
        };
        fetchStats();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Thống kê hệ thống
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid size={{xs: 12, sm: 4}}>
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <GroupIcon color="primary" fontSize="large" />
                                <Box>
                                    <Typography variant="h6">{stats.totalUsers}</Typography>
                                    <Typography variant="body2" color="text.secondary">Người dùng</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 4}}>
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <QuizIcon color="secondary" fontSize="large" />
                                <Box>
                                    <Typography variant="h6">{stats.totalQuizzes}</Typography>
                                    <Typography variant="body2" color="text.secondary">Bộ câu hỏi</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 4}}>
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PlayArrowIcon sx={{ color: '#43a047' }} fontSize="large" />
                                <Box>
                                    <Typography variant="h6">{stats.totalPlays}</Typography>
                                    <Typography variant="body2" color="text.secondary">Lượt chơi</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Biểu đồ lượt chơi 7 ngày gần nhất
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.playStats}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#1976d2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default Dashboard;