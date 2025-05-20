import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Select, 
    MenuItem, 
    FormControl,
    
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GradeIcon from '@mui/icons-material/Grade';
import DeleteIcon from '@mui/icons-material/Delete';
// @project
import styles from './styles.module.scss';
import { Question } from '../../../types/question';

interface SettingsPanelProps {
    question: Question;
    onQuestionChange?: (question: Question) => void;
    onQuestionDelete?: (questionId: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    question,
    onQuestionChange,
    onQuestionDelete
}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Mở dialog xác nhận
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    // Đóng dialog xác nhận
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    // Xử lý khi người dùng xác nhận xóa
    const handleConfirmDelete = () => {
        if (onQuestionDelete) {
            onQuestionDelete(question.id);
        }
        setOpenDeleteDialog(false);
    };


    return (
        <Box className={styles.settingsPanel}>
            {/* Loại câu hỏi */}
            <Box className={styles.settingItem}>
                <Box className={styles.settingLabel}>
                    <QuizIcon fontSize="small" />
                    <Typography>Loại câu hỏi</Typography>
                </Box>
                <FormControl fullWidth size="small">
                    <Select
                        value={question.type}
                        onChange={(e) => onQuestionChange?.({ ...question, type: e.target.value })}
                        className={styles.selectControl}
                    >
                        <MenuItem value="choice">
                            <Box className={styles.menuItemWithIcon}>
                                <Box className={styles.colorIcon} sx={{ backgroundColor: '#FF3355' }} />
                                Trắc nghiệm
                            </Box>
                        </MenuItem>
                        <MenuItem value="text">
                            <Box className={styles.menuItemWithIcon}>
                                <Box className={styles.colorIcon} sx={{ backgroundColor: '#22CC77' }} />
                                Tự luận
                            </Box>
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Giới hạn thời gian */}
            <Box className={styles.settingItem}>
                <Box className={styles.settingLabel}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography>Giới hạn thời gian</Typography>
                </Box>
                <FormControl fullWidth size="small">
                    <Select
                        value={question.time_limit}
                        onChange={(e) => onQuestionChange?.({ ...question, time_limit: Number(e.target.value) })}
                        className={styles.selectControl}
                    >
                        <MenuItem value={10}>10 giây</MenuItem>
                        <MenuItem value={15}>15 giây</MenuItem>
                        <MenuItem value={20}>20 giây</MenuItem>
                        <MenuItem value={30}>30 giây</MenuItem>
                        <MenuItem value={45}>45 giây</MenuItem>
                        <MenuItem value={60}>1 phút</MenuItem>
                        <MenuItem value={90}>1 phút 30 giây</MenuItem>
                        <MenuItem value={120}>2 phút</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Điểm */}
            <Box className={styles.settingItem}>
                <Box className={styles.settingLabel}>
                    <GradeIcon fontSize="small" />
                    <Typography>Điểm</Typography>
                </Box>
                <FormControl fullWidth size="small">
                    <Select
                        value={question.point}
                        onChange={(e) => onQuestionChange?.({ ...question, point: Number(e.target.value) })}
                        className={styles.selectControl}
                    >
                        <MenuItem value={10}>Tiêu chuẩn</MenuItem>
                        <MenuItem value={20}>Gấp đôi điểm</MenuItem>
                        <MenuItem value={0}>Không tính điểm</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Footer Buttons */}
            <Box className={styles.panelFooter}>
                <Box 
                    className={styles.footerButton}
                    onClick={handleOpenDeleteDialog}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Xoá
                </Box>
                <Box 
                    className={styles.footerButtonPrimary}
                    onClick={() => console.log("Sao chép câu hỏi")}
                >
                    Sao chép
                </Box>
            </Box>

            {/* Dialog xác nhận xóa */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Xóa câu hỏi
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SettingsPanel;