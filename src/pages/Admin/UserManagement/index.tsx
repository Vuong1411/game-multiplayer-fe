import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Alert,
    SelectChangeEvent,
    Menu
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MoreVert, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, SupervisorAccount, Group } from '@mui/icons-material';
import { userService } from '@project/services';
import { User } from '@project/types/user';

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'admin' as 'admin' | 'user',
    });
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuRow, setMenuRow] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const usersData = await userService.getAll();
                setUsers(usersData);
                setError(null);
            } catch (err) {
                setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (showModal) {
            if (selectedUser) {
                setFormData({
                    username: selectedUser.username,
                    email: selectedUser.email,
                    password: '',
                    role: selectedUser.role,
                });
            } else {
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    role: 'admin',
                });
            }
        }
    }, [showModal, selectedUser]);

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: User) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuRow(row);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuRow(null);
    };

    const handleEdit = () => {
        if (menuRow) {
            setSelectedUser(menuRow);
            setShowModal(true);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (menuRow && window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                const message = await userService.delete(menuRow.id);
                setUsers(prev => prev.filter(u => u.id !== menuRow.id));
                alert(message);
            } catch (error) {
                alert(
                    error instanceof Error
                        ? error.message
                        : 'Xóa người dùng thất bại!'
                );
            }
        }
        handleMenuClose();
    };

    const handleRoleChange = async (id: number, newRole: User['role']) => {
        if (window.confirm(`Bạn có chắc muốn thay đổi vai trò của người dùng này thành ${newRole === 'admin' ? 'Admin' : 'User'}?`)) {
            try {
                const user = users.find(u => u.id === id);
                if (!user) return;
                const message = await userService.update(id, { role: newRole });
                setUsers(prev => prev.map(user =>
                    user.id === id ? { ...user, role: newRole } : user
                ));
                alert(message);
            } catch (err) {
                alert(
                    err instanceof Error
                        ? err.message
                        : 'Không thể cập nhật vai trò người dùng. Vui lòng thử lại sau.'
                );
            }
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value as string,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (selectedUser) {
                const updateData: { username?: string; email?: string } = {};
                if (formData.username.trim() !== selectedUser.username) {
                    updateData.username = formData.username.trim();
                }
                if (formData.email.trim() !== selectedUser.email) {
                    updateData.email = formData.email.trim();
                }
                if (Object.keys(updateData).length === 0) {
                    setShowModal(false);
                    return;
                }
                try {
                    await userService.update(selectedUser.id, { ...selectedUser, ...updateData });
                    setShowModal(false);
                    // Cập nhật trực tiếp user thay vì gọi lại getAll
                    setUsers(prev => prev.map(user =>
                        user.id === selectedUser.id ? { ...user, ...updateData } : user
                    ));
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    } else {
                        setError('Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.');
                    }
                    return;
                }
            } else {
                const createData = {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: formData.role as 'admin' | 'user',
                };
                await userService.create(createData);
                const usersData = await userService.getAll();
                setUsers(usersData);
                setShowModal(false);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Không thể lưu thông tin người dùng. Vui lòng thử lại sau.');
            }
        }
    };

    // Định nghĩa columns cho DataGrid
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'username',
            headerName: 'Tên người dùng',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Box display="flex" alignItems="center">
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 18,
                            mr: 2,
                        }}
                    >
                        {params.row.username.charAt(0).toUpperCase()}
                    </Box>
                    <Typography>{params.row.username}</Typography>
                </Box>
            ),
        },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
        {
            field: 'role',
            headerName: 'Vai trò',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <FormControl size="small" fullWidth>
                    <Select
                        value={params.row.role}
                        onChange={(e) => handleRoleChange(params.row.id, e.target.value as User['role'])}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </Select>
                </FormControl>
            ),
        },
        {
            field: 'created_at',
            headerName: 'Ngày tạo',
            width: 120,
            valueFormatter: (params) =>
                new Date(params as string).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
        },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            align: 'right',
            renderCell: (params: GridRenderCellParams) => (
                <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
                    <MoreVert />
                </IconButton>
            ),
        },
    ];

    if (loading) {
        return (
            <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box py={2} px={4} sx={{ width: '100%' }}>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700}>Quản lý người dùng</Typography>
                <Typography variant="body2" color="text.secondary">
                    Quản lý và theo dõi tất cả người dùng trong hệ thống
                </Typography>
            </Box>

            {/* Statistics */}
            <Box display="flex" gap={3} mb={4} flexWrap="wrap">
                <div
                    style={{
                        padding: 24,
                        flex: 1,
                        minWidth: 220,
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e3e6ef',
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <Group color="primary" sx={{ fontSize: 36, mr: 2 }} />
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">Tổng số người dùng</Typography>
                            <Typography variant="h5">{users.length}</Typography>
                        </Box>
                    </Box>
                </div>
                <div
                    style={{
                        padding: 24,
                        flex: 1,
                        minWidth: 220,
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e3e6ef',
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <SupervisorAccount color="secondary" sx={{ fontSize: 36, mr: 2 }} />
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">Số lượng Admin</Typography>
                            <Typography variant="h5">{users.filter(u => u.role === 'admin').length}</Typography>
                        </Box>
                    </Box>
                </div>
            </Box>

            {/* Search and Actions */}
            <div
                style={{
                    padding: 24,
                    marginBottom: 24,
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e3e6ef',
                }}
            >
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ flex: 1, minWidth: 220 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SupervisorAccount />}
                        onClick={() => {
                            setSelectedUser(null);
                            setShowModal(true);
                        }}
                    >
                        Thêm Admin
                    </Button>
                </Box>
            </div>

            {/* DataGrid Table */}
            <div style={{ height: 520, width: '100%', background: '#fff', borderRadius: 10 }}>
                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    checkboxSelection
                    getRowId={(row) => row.id}
                    localeText={{
                        noRowsLabel: searchTerm
                            ? 'Không tìm thấy người dùng nào phù hợp'
                            : 'Chưa có người dùng nào',
                    }}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            alignItems: 'center',
                            display: 'flex',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            justifyContent: 'center',
                        },
                    }}
                />
            </div>

            {/* Context Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEdit} sx={{ color: 'warning.main' }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Sửa
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Xóa
                </MenuItem>
            </Menu>

            {/* Edit/Add Modal */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm admin'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            label="Tên người dùng"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            margin="normal"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        {!selectedUser && (
                            <TextField
                                margin="normal"
                                label="Mật khẩu"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        )}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                label="Vai trò"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                            </Select>
                        </FormControl>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
                            <Button onClick={() => setShowModal(false)} color="inherit">
                                Hủy
                            </Button>
                            <Button type="submit" variant="contained">
                                {selectedUser ? 'Lưu thay đổi' : 'Thêm'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}