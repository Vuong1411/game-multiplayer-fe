import React, { useState } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridValueGetter } from '@mui/x-data-grid';
import { QuestionReport } from '@project/types';
import { Box, Typography } from '@mui/material';

interface ListQuestionProps {
    questions: QuestionReport[];
}

const columns: GridColDef[] = [
    {
        field: 'index',
        headerName: 'STT',
        width: 70,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
    },
    { field: 'question_id', headerName: 'ID', width: 80 },
    { field: 'question_content', headerName: 'Câu hỏi', flex: 1, minWidth: 200 },
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
    { field: 'correct_count', headerName: 'Số đúng', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'total_count', headerName: 'Tổng trả lời', width: 120, align: 'center', headerAlign: 'center' },
    { field: 'correct_percent', headerName: 'Tỷ lệ đúng (%)', width: 120, align: 'center', headerAlign: 'center' },
];

const ListQuestion: React.FC<ListQuestionProps> = ({ questions }) => {
    const rowsWithIndex = questions.map((q, idx) => ({
        ...q,
        index: idx + 1,
    }));
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

    return (
        <Box sx={{ height: 520, width: '100%', background: '#fff', borderRadius: 2 }}>
            <Typography variant="h6" mb={2}>Thống kê câu hỏi</Typography>
            <DataGrid
                rows={rowsWithIndex}
                columns={columns}
                getRowId={(row) => row.question_id}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                sx={{
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                    },
                }}
            />
        </Box>
    );
};

export default ListQuestion;