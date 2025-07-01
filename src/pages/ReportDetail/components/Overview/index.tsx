import React from 'react';
import { Grid, Card, CardHeader, CardContent, Box, Typography, Button, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './styles.module.scss';
import { PlayerReport, QuestionReport } from '@project/types';
import { RoomReportDetails } from '@project/types';

interface OverviewProps {
    correctPercent: number;
    report: RoomReportDetails | null;
    players?: PlayerReport[];
    questions?: QuestionReport[];
}

const Overview: React.FC<OverviewProps> = ({ correctPercent, report, players = [], questions = [] }) => {
    // 5 người chơi có điểm số thấp nhất
    const lowestPlayers = [...players]
        .sort((a, b) => a.score - b.score);

    // 5 câu hỏi tỷ lệ đúng thấp nhất
    const lowestQuestions = [...questions]
        .sort((a, b) => (a.correct_percent ?? 100) - (b.correct_percent ?? 100));
    return (
        <>
            {/* Tổng quan */}
            <Grid container spacing={2} className={styles.overviewGrid}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card className={styles.overviewCard}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Box className={styles.circlePercent}>
                                    <Typography variant="h5" fontWeight={700}>{correctPercent}%</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h3" fontWeight={700} mb={2}>Có công mài sắt, có ngày nên kim!</Typography>
                                    <Typography variant="body1" color="text.secondary" mb={2}>
                                        Hãy chơi lại để nhóm hiện tại cải thiện điểm số hoặc xem liệu người tham gia mới có thể vượt qua kết quả này không nhé.
                                    </Typography>
                                    <Button variant="contained">Chơi lại</Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card className={styles.overviewCard}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Box display="flex" alignItems="center">
                                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography>Người tham gia:</Typography>
                                </Box>
                                <Typography>{report?.total_players}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Box display="flex" alignItems="center">
                                    <HelpOutlineIcon color="info" sx={{ mr: 1 }} />
                                    <Typography>Câu hỏi:</Typography>
                                </Box>
                                <Typography>{report?.total_questions}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Box display="flex" alignItems="center">
                                    <AccessTimeIcon color="success" sx={{ mr: 1 }} />
                                    <Typography>Thời gian:</Typography>
                                </Box>
                                <Typography>{(report?.avg_response_time)}s</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography className={styles.tips} variant="caption" color="text.secondary" mt={2} display="block">
                                Mẹo hay: Thu hút tương tác của người tham gia bằng cách chia sẻ bục vinh danh.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Báo cáo nâng cao */}
            <Typography variant="h6" mt={4} mb={2}>Báo cáo nâng cao</Typography>
            <Grid container spacing={2} className={styles.advancedReport}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card className={styles.advancedCard}>
                        <CardHeader
                            title={`Câu hỏi khó (${lowestQuestions.length})`}
                            sx={{
                                py: 1,
                                px: 2,
                                minHeight: 28,
                                '& .MuiCardHeader-title': {
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                },
                            }}
                        />
                        <CardContent>
                            {lowestQuestions.length === 0 ? (
                                <Typography color="text.secondary">Tuyệt vời! Không ai thấy câu hỏi nào quá khó.</Typography>
                            ) : (
                                lowestQuestions.map((q, idx) => (
                                    <Box key={q.question_id} display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography>{idx + 1}. {q.question_content}</Typography>
                                        <Typography color="warning.main">{q.correct_percent}%</Typography>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card className={styles.advancedCard}>
                        <CardHeader
                            title={`Người tham gia (${players.length})`}
                            sx={{
                                py: 1,
                                px: 2,
                                minHeight: 28,
                                '& .MuiCardHeader-title': {
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                },
                            }}
                        />
                        <CardContent>
                            {players.length === 0 ? (
                                <Typography color="text.secondary">Không có dữ liệu.</Typography>
                            ) : (
                                players.map((p, idx) => (
                                    <Box key={p.id} display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography>{idx + 1}. {p.nickname}</Typography>
                                        <Typography color="error">{p.score}</Typography>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card className={styles.advancedCard}>
                        <CardHeader
                            title={`Cần giúp đỡ (${lowestPlayers.length})`}
                            sx={{
                                py: 1,
                                px: 2,
                                minHeight: 28,
                                '& .MuiCardHeader-title': {
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                },
                            }}
                        />
                        <CardContent>
                            {lowestPlayers.length === 0 ? (
                                <Typography color="text.secondary">Không có dữ liệu.</Typography>
                            ) : (
                                lowestPlayers.map((p, idx) => (
                                    <Box key={p.id} display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography>{idx + 1}. {p.nickname}</Typography>
                                        <Typography color="error">
                                            {p.correct_answers}/{report?.total_questions}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Overview;