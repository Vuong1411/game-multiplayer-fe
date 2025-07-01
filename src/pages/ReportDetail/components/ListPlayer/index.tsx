import React, { useState } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { PlayerReport, PlayerAnswerReport } from '@project/types';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { roomService } from '@project/services';

interface ListPlayerProps {
    players: PlayerReport[];
}

const columns: GridColDef[] = [
    { field: 'rank', headerName: 'Thứ hạng', width: 100, align: 'center', headerAlign: 'center', sortable: false },
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nickname', headerName: 'Tên người chơi', flex: 1, minWidth: 150 },
    { field: 'score', headerName: 'Điểm', width: 100, type: 'number', align: 'center', headerAlign: 'center' },
    { field: 'correct_answers', headerName: 'Đúng', width: 100, type: 'number', align: 'center', headerAlign: 'center' },
    { field: 'wrong_answers', headerName: 'Sai', width: 100, type: 'number', align: 'center', headerAlign: 'center' },
];

const ListPlayer: React.FC<ListPlayerProps> = ({ players }) => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerReport | null>(null);
    const [answers, setAnswers] = useState<PlayerAnswerReport[] | null>(null);
    const [loading, setLoading] = useState(false);

    const playersWithRank = players.map((p, idx) => ({
        ...p,
        rank: idx + 1,
    }));

    const handleRowDoubleClick = async (params: any) => {
        setSelectedPlayer(params.row);
        setLoading(true);
        try {
            // Giả sử bạn cần truyền roomId, hãy bổ sung nếu cần
            const data = await roomService.getPlayerAnswerReports(params.row.id);
            setAnswers(data);
        } catch (e) {
            setAnswers([]);
        }
        setLoading(false);
    };

    if (!players || players.length === 0) {
        return (
            <Box sx={{ py: 4 }}>
                <Typography align="center" color="text.secondary">
                    Không có người chơi nào trong phòng này.
                </Typography>
            </Box>
        );
    }
    return (
        <>
            <Box style={{ height: 520, width: '100%', background: '#fff', borderRadius: 10 }}>
                <Typography variant="h6" mb={2}>Thống kê người chơi</Typography>
                <DataGrid
                    rows={playersWithRank}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    onRowDoubleClick={handleRowDoubleClick}
                    sx={{
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                    },
                }}
                />
            </Box>
            <Dialog
                open={!!selectedPlayer}
                onClose={() => { setSelectedPlayer(null); setAnswers(null); }}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Câu hỏi đã trả lời: {selectedPlayer?.nickname}
                    <IconButton
                        aria-label="close"
                        onClick={() => { setSelectedPlayer(null); setAnswers(null); }}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {loading ? (
                        <Typography align="center" sx={{ py: 3 }}>Đang tải...</Typography>
                    ) : answers && answers.length > 0 ? (
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={answers}
                                columns={[
                                    { field: 'question_id', headerName: 'ID', width: 70 },
                                    { field: 'question_content', headerName: 'Câu hỏi', flex: 1, minWidth: 180 },
                                    {
                                        field: 'question_image',
                                        headerName: 'Ảnh',
                                        width: 80,
                                        renderCell: (params) =>
                                            params.value ? (
                                                <img
                                                    src={params.value}
                                                    alt="question"
                                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                                />
                                            ) : null,
                                        sortable: false,
                                        filterable: false,
                                    },
                                    { field: 'answer_content', headerName: 'Đáp án', flex: 1, minWidth: 120 },
                                    { field: 'answer_text', headerName: 'Text', flex: 1, minWidth: 120 },
                                    {
                                        field: 'is_correct',
                                        headerName: 'Đúng/Sai',
                                        width: 90,
                                        renderCell: (params) =>
                                            params.value ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <CancelIcon color="error" />
                                            ),
                                        align: 'center',
                                        headerAlign: 'center',
                                    },
                                    { field: 'points', headerName: 'Điểm', width: 80 },
                                    { field: 'response_time', headerName: 'Thời gian (s)', width: 120 },
                                ]}
                                getRowId={(row) => row.question_id}
                                pageSizeOptions={[5, 10, 20]}
                                disableRowSelectionOnClick
                                hideFooterSelectedRowCount
                            />
                        </div>
                    ) : (
                        <Typography color="text.secondary">
                            Không có dữ liệu câu hỏi đã trả lời cho người chơi này.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ListPlayer;