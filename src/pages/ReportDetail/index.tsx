import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Button, Divider, Menu, MenuItem, ListItemIcon, Snackbar, Alert } from '@mui/material';
// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
// @project
import styles from './styles.module.scss';
import { PlayerReport, QuestionReport } from '@project/types';
import { RoomReportDetails } from '@project/types';
import { roomService } from '@project/services';

import Overview from './components/Overview';
import ListPlayer from './components/ListPlayer';
import ListQuestion from './components/ListQuestion';
import ExportReports from '@project/features/export/ExportReports';

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<RoomReportDetails | null>(null);
    const [players, setPlayers] = useState<PlayerReport[]>();
    const [questions, setQuestions] = useState<QuestionReport[]>([]);
    const [tab, setTab] = useState(0);
    const [notification, setNotification] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'warning' | 'info' }>({
        open: false,
        message: '',
        severity: 'success'
    });
    const handleCloseNotification = () => setNotification(prev => ({ ...prev, open: false }));

    useEffect(() => {
        if (!id) return;
        const fetchReport = async () => {
            try {
                const roomReportData = await roomService.report(Number(id));
                setReport(roomReportData);
                const playerReportsData = await roomService.getPlayerReports(Number(id));
                setPlayers(playerReportsData);
                const questionReportsData = await roomService.getQuestionReports(Number(id));
                setQuestions(questionReportsData);
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

    const handleDeleteReport = async () => {
        if (!id) return;
        if (!window.confirm('Bạn có chắc chắn muốn xoá báo cáo này?')) return;
        try {
            await roomService.delete(Number(id));
            setNotification({ open: true, message: 'Xoá báo cáo thành công! Đang chuyển hướng...', severity: 'success' });
            setTimeout(() => {
                navigate('/reports');
            }, 1500);
        } catch (error) {
            setNotification({ open: true, message: 'Xoá báo cáo thất bại!', severity: 'error' });
        }
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
                                <DeleteIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <Typography
                                variant="inherit"
                                color="error"
                                sx={{ fontWeight: 500 }}
                                onClick={handleDeleteReport}
                            >
                                Xóa
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" color="success" />
                            </ListItemIcon>
                            {report && (
                                <ExportReports
                                    report={report}
                                    players={players || []}
                                    questions={questions || []}
                                />
                            )}
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
            {tab === 0 && (
                <Overview correctPercent={correctPercent} report={report} players={players} questions={questions} />
            )}
            {/* Người tham gia */}
            {tab === 1 && (
                <ListPlayer players={players || []} />
            )}
            {/* Câu hỏi */}
            {tab === 2 && (
                <ListQuestion questions={questions || []} />
            )}

            <Snackbar
                open={notification.open}
                autoHideDuration={3500}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default ReportDetail;