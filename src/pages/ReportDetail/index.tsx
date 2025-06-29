import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Card, CardContent, Button, Grid, Divider, Menu, MenuItem, ListItemIcon } from '@mui/material';
// Icons
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
// @project
import styles from './styles.module.scss';
import { RoomReportDetails } from '@project/types';
import { roomService, reportService } from '@project/services';

const ReportDetail = () => {
    const { id } = useParams();
    const [report, setReport] = useState<RoomReportDetails | null>(null);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (!id) return;
        const fetchReport = async () => {
            try {
                const roomReportData = await roomService.report(Number(id));
                setReport(roomReportData);
                const playerReportsData = await reportService.getPlayerReports(Number(id));
                console.log('Player Reports:', playerReportsData);
            } catch (error) {
                console.error('Error fetching report:', error);
            }
        }
        fetchReport();
    }, [id]);

    // Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Calculate
    const correctPercent = report && report.total_questions
        ? Math.round((report.total_correct_answers / (report.total_questions * report.total_players)) * 100)
        : 0;

    return (
        <Box className={styles.reportDetailContainer}>
            <Box className={styles.header}>
                {/* Left */}
                <Box className={styles.headerLeft}>
                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Báo cáo</Typography>
                    <Box className={styles.headerTitleRow}>
                        <Typography variant="h2" fontWeight={700}>
                            {report?.question_set_title}
                        </Typography>
                    </Box>
                </Box>
                {/* Center */}
                <Box className={styles.headerActions}>
                    <Button
                        variant="text"
                        size="small"
                        className={styles.headerActionText}
                        endIcon={<MoreVertIcon />}
                        onClick={handleMenuClick}
                    >
                        Tuỳ chọn báo cáo
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            Xoá
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <ShareIcon fontSize="small" />
                            </ListItemIcon>
                            Chia sẻ
                        </MenuItem>
                    </Menu>
                </Box>

                {/* Right */}
                <Box className={styles.headerRight}>
                    <Box className={styles.headerStatusRow}>
                        <Typography>
                            Live
                        </Typography>
                    </Box>
                    <hr className={styles.headerDivider} />
                    <Typography >{report?.created_at}</Typography>
                    <hr className={styles.headerDivider} />
                    <Typography >Do {report?.host_username} tổ chức</Typography>
                </Box>
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} className={styles.tabs}>
                <Tab label="Tóm tắt" />
                <Tab label={`Người tham gia (${report?.total_players})`} />
                <Tab label={`Câu hỏi (${report?.total_questions})`} />
                <Tab label="Phản hồi" />
            </Tabs>

            <Divider sx={{ my: 2 }} />

            {/* Tổng quan */}
            <Grid container spacing={2} className={styles.overviewGrid}>
                <Grid size={8}>
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
                <Grid size={4}>
                    <Card className={styles.overviewCard}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Box display="flex" alignItems="center">
                                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography>
                                        Người tham gia:
                                    </Typography>
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
                                <Typography>{report?.avg_response_time}s</Typography>
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
                <Grid size={4}>
                    <Card className={styles.advancedCard}>
                        <CardContent>
                            <Typography fontWeight={700}>Câu hỏi khó (0)</Typography>
                            <Typography color="text.secondary" mt={2}>Tuyệt vời! Không ai thấy câu hỏi nào quá khó.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card className={styles.advancedCard}>
                        <CardContent>
                            <Typography fontWeight={700}>Người tham gia (1)</Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Typography>Nok</Typography>
                                <Typography>10%</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Typography>Vijf</Typography>
                                <Typography>0%</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card className={styles.advancedCard}>
                        <CardContent>
                            <Typography fontWeight={700}>Chưa hoàn thành (1)</Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Typography>KSK</Typography>
                                <Typography>0%</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReportDetail;