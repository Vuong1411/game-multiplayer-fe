import React from 'react';
import { Typography } from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { RoomReportDetails, PlayerReport, QuestionReport } from 'src/types/report';

interface ExportReportsProps {
    report: RoomReportDetails;
    players: PlayerReport[];
    questions: QuestionReport[];
}

const ExportReports: React.FC<ExportReportsProps> = ({ report, players, questions }) => {
    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        const now = new Date();
        const fileName = `BaoCao_${report.room_id}_${now.toLocaleString('vi-VN').replace(/[/:]/g, '-')}.xlsx`;

        // Sheet 1: Thông tin phòng
        const sheet1 = workbook.addWorksheet('Thông tin phòng');

        // Tiêu đề
        sheet1.addRow(['BÁO CÁO PHÒNG']);
        sheet1.mergeCells('A1:B1');
        sheet1.getCell('A1').font = { bold: true, size: 16 };
        sheet1.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

        // Dữ liệu
        const infoRows = [
            ['Mã phòng', report.room_id],
            ['PIN', report.pin],
            ['Loại phòng', report.room_type],
            ['Trạng thái', report.status],
            ['Ngày tạo', report.created_at],
            ['Ngày kết thúc', report.ended_at],
            ['Chủ phòng', report.host_username],
            ['Bộ câu hỏi', report.question_set_title],
            ['Tổng người chơi', report.total_players],
            ['Tổng câu hỏi', report.total_questions],
            ['Tổng trả lời đúng', report.total_correct_answers],
            ['Tổng trả lời sai', report.total_wrong_answers],
            ['Thời gian TB (s)', report.avg_response_time]
        ];

        infoRows.forEach(row => sheet1.addRow(row));

        // Định dạng cột
        sheet1.columns = [
            { width: 25 },
            { width: 40 },
        ];

        // Định dạng border và font cho toàn bộ bảng
        sheet1.eachRow((row, rowNumber) => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (rowNumber === 1) {
                    cell.font = { bold: true, size: 16 };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                } else {
                    cell.font = { size: 12 };
                    cell.alignment = { horizontal: 'left', vertical: 'middle' };
                }
            });
        });

        // Sheet 2: Người chơi
        const sheet2 = workbook.addWorksheet('Người chơi');
        const playerHeader = [
            'STT', 'ID', 'Tên', 'Điểm', 'Số câu đúng', 'Số câu sai'
        ];
        sheet2.addRow(playerHeader);
        players.forEach((p, idx) => {
            sheet2.addRow([
                idx + 1,
                p.id,
                p.nickname,
                p.score,
                p.correct_answers,
                p.wrong_answers,
            ]);
        });
        sheet2.columns = [
            { width: 6 }, { width: 8 }, { width: 18 }, { width: 10 }, { width: 12 }, { width: 12 }
        ];
        sheet2.eachRow((row, rowNumber) => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (rowNumber === 1) {
                    cell.font = { bold: true };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFDDEEFF' }
                    };
                }
            });
        });

        // Sheet 3: Câu hỏi
        const sheet3 = workbook.addWorksheet('Câu hỏi');
        const questionHeader = [
            'STT', 'ID', 'Nội dung', 'Ảnh', 'Số người đúng', 'Tổng lượt trả lời', 'Tỉ lệ đúng (%)'
        ];
        sheet3.addRow(questionHeader);
        questions.forEach((q, idx) => {
            sheet3.addRow([
                idx + 1,
                q.question_id,
                q.question_content,
                q.question_image || '',
                q.correct_count,
                q.total_count,
                q.correct_percent,
            ]);
        });
        sheet3.columns = [
            { width: 6 }, { width: 8 }, { width: 40 }, { width: 20 }, { width: 14 }, { width: 18 }, { width: 16 }
        ];
        sheet3.eachRow((row, rowNumber) => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (rowNumber === 1) {
                    cell.font = { bold: true };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFDDEEFF' }
                    };
                }
            });
        });

        // Thông báo khi xuất xong
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), fileName);
            alert('Xuất file Excel thành công!');
        });
    };

    return (
        <Typography
            variant="inherit"
            color="success"
            sx={{ fontWeight: 500 }}
            onClick={handleExport}
        >
            Xuất Excel
        </Typography>
    );
};

export default ExportReports;