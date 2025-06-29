import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Tabs, Tab, TextField, InputAdornment,
    IconButton, Menu, MenuItem, Button,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
// @Project
import styles from './styles.module.scss';
import { RoomReport } from '@project/types';
import { roomService } from '@project/services/room.service';

const Report = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [type, setType] = useState<'sync' | 'async'>('sync');
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [selectedReports, setSelectedReports] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loadingReports, setLoadingReports] = useState(true);
    const [reports, setReports] = useState<RoomReport[]>([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    useEffect(() => {
        const fetchReports = async () => {
            setLoadingReports(true);
            try {
                const data = await roomService.reports(type);
                setReports(data);
            } catch (error) {
                setReports([]);
            }
            setLoadingReports(false);
        };
        fetchReports();
    }, [type]);

    const handleReportClick = (reportId: number) => {
        navigate(`/reports/${reportId}`);
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setType(newValue === 0 ? 'sync' : 'async');
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, roomId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedRoomId(roomId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteReport = async (roomId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xoá báo cáo này?')) return;
        try {
            const message = await roomService.delete(roomId);
            setReports((prev) => prev.filter((r) => r.room_id !== roomId));
            alert(message);
        } catch (error) {
            alert('Xoá báo cáo thất bại!');
        }
    };

    const handleDeleteSelectedReports = async () => {
        if (selectedReports.length === 0) return;
        if (!window.confirm('Bạn có chắc chắn muốn xoá các báo cáo đã chọn?')) return;
        try {
            const message = await roomService.deleteMany(selectedReports);
            setReports((prev) => prev.filter((r) => !selectedReports.includes(r.room_id)));
            setSelectedReports([]);
            alert(message);
        } catch (error) {
            alert('Xoá báo cáo thất bại!');
        }
    };

    // DataGrid columns
    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'Tiêu đề',
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 120,
            renderCell: (params) => (
                <span className={`${styles.statusChip} ${styles.completed}`}>{params.value}</span>
            ),
        },
        {
            field: 'created_at',
            headerName: 'Bắt đầu',
            width: 160,
        },
        {
            field: 'ended_at',
            headerName: 'Kết thúc',
            width: 160,
        },
        {
            field: 'total_players',
            headerName: 'Người tham gia',
            width: 140,
            align: 'center',
            renderCell: (params) => (
                <Box className={styles.participantsCell}>
                    <Typography variant="body2">{params.value}</Typography>
                    <PersonIcon fontSize="small" />
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: '',
            width: 60,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={(event) => {
                        event.stopPropagation();
                        handleMenuOpen(event, params.row.room_id);
                    }}
                >
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];

    // Lọc theo searchQuery nếu cần
    const filteredReports = reports.filter((report) => {
        const query = searchQuery.toLowerCase();
        return (
            (report.title || '').toLowerCase().includes(query) ||
            (report.status || '').toLowerCase().includes(query) ||
            (report.created_at || '').toLowerCase().includes(query) ||
            (report.ended_at || '').toLowerCase().includes(query) ||
            String(report.total_players).includes(query) ||
            String(report.room_id).includes(query)
        );
    });

    return (
        <Box className={styles.reportsContainer}>
            <Box className={styles.reportsHeader}>
                <Typography variant="h4" className={styles.pageTitle}>
                    Tất cả báo cáo
                </Typography>
            </Box>

            {/* Tabs phân loại */}
            <Box className={styles.filterTabs}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    className={styles.tabs}
                >
                    <Tab
                        label="Chế độ Live"
                        className={`${styles.tab} ${tabValue === 0 ? styles.activeTab : ''}`}
                    />
                    <Tab
                        label="Chế độ Solo"
                        className={`${styles.tab} ${tabValue === 1 ? styles.activeTab : ''}`}
                    />
                </Tabs>
            </Box>

            {/* Tìm kiếm */}
            <Box className={styles.sortContainer}>
                <Typography variant="body2">Tìm kiếm nhanh:</Typography>
                <Box className={styles.headerActions}>
                    <TextField
                        placeholder="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        className={styles.searchField}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {selectedReports.length > 0 && (
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleDeleteSelectedReports}
                        >
                            Xoá ({selectedReports.length})
                        </Button>
                    )}
                </Box>
            </Box>

            {/* DataGrid Table */}
            <div style={{ height: 520, width: '100%', background: '#fff', borderRadius: 10 }}>
                <DataGrid
                    rows={filteredReports}
                    columns={columns}
                    getRowId={(row) => row.room_id}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    loading={loadingReports}
                    onRowDoubleClick={(params) => handleReportClick(params.row.room_id)}
                    onRowSelectionModelChange={(selection) => {
                        const ids = Array.from(selection.ids ?? []);
                        setSelectedReports(ids as number[]);
                    }}
                />
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Xem báo cáo</MenuItem>
                <MenuItem onClick={handleMenuClose}>Chia sẻ báo cáo</MenuItem>
                <MenuItem
                    onClick={() => {
                        // Giả sử bạn lưu roomId vào state khi mở menu
                        if (selectedRoomId) {
                            handleDeleteReport(selectedRoomId);
                            handleMenuClose();
                        }
                    }}
                >
                    Xoá báo cáo
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Report;