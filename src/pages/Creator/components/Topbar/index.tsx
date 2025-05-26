import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Grid
} from '@mui/material';
import SettingIcon from '@mui/icons-material/Settings';
// @project
import styles from './styles.module.scss';
import ImageUploadCard from '../ImageUploadCard';
import logo from '@project/assets/logo.png';
import { QuestionSet } from '@project/types/question';

export interface TopbarProps {
    quiz: QuestionSet | null;
    onSave?: () => void;
    onQuestionSetChange?: (newQuiz: Partial<QuestionSet>) => void;
    onQuestionSetImageChange?: (url: string | undefined, file?: File) => void;
}

const Topbar = ({ quiz, onSave, onQuestionSetChange, onQuestionSetImageChange }: TopbarProps) => {
    const navigate = useNavigate();
    const [openSettings, setOpenSettings] = useState(false);
    const [tempData, setTempData] = useState<Partial<QuestionSet>>({});
    const [image, setImage] = useState<File>();

    const handleOpenSettings = () => {
        setTempData({
            title: quiz?.title || '',
            description: quiz?.description || '',
            image_url: quiz?.image_url || ''
        });
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
        setTempData({});
    };

    const handleSaveSettings = () => {
        if (Object.keys(tempData).length > 0) {
            onQuestionSetChange?.(tempData);
        }
        setOpenSettings(false);
        setTempData({});
    };



    return (
        <AppBar
            position="fixed"
            className={styles.appBar}
            elevation={0}
        >
            <Toolbar className={styles.toolbar}>
                {/* Left section */}
                <Box className={styles.leftSection}>
                    {/* Logo */}
                    <Box
                        component="img"
                        src={logo}
                        alt="Kahoot Logo"
                        className={styles.logo}
                        onClick={() => navigate('/')}
                    />

                    {/* Cài đặt */}
                    <Box className={styles.settingsGroup} onClick={handleOpenSettings}>
                        {/* Tiêu đề */}
                        <TextField
                            value={quiz?.title}
                            placeholder={"Nhập tiêu đề"}
                            variant="standard"
                            className={styles.titleInput}
                        />

                        {/* Settings button */}
                        <Button
                            variant="text"
                            className={styles.settingsButton}
                        >
                            Cài đặt
                        </Button>
                    </Box>
                </Box>

                {/* Right section */}
                <Box className={styles.rightSection}>
                    <Button
                        variant="text"
                        className={styles.actionButton}
                    >
                        Nâng cấp
                    </Button>

                    <Button
                        variant="contained"
                        className={styles.playButton}
                    >
                        Giao diện
                    </Button>

                    <Button
                        variant="text"
                        className={styles.actionButton}
                    >
                        Xem trước
                    </Button>

                    <Button
                        variant="text"
                        className={styles.actionButton}
                    >
                        Thoát
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        className={styles.saveButton}
                        onClick={onSave}
                    >
                        Lưu
                    </Button>
                </Box>
            </Toolbar>

            {/* Settings Dialog */}
            <Dialog
                open={openSettings}
                onClose={handleCloseSettings}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    style: {
                        minHeight: '700px',
                        maxHeight: '90vh',
                    }
                }}
            >
                {/* Dialog Title */}
                <DialogTitle className={styles.dialogTitle}>
                    <Box className={styles.dialogTitleContent}>
                        <SettingIcon />
                        <Typography variant="h6" className={styles.dialogTitleText}>
                            Cài đặt
                        </Typography>
                    </Box>
                    <Box className={styles.dialogTitleContent}>
                        <Button
                            onClick={handleCloseSettings}
                            color="primary"
                            className={styles.actionButton}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSaveSettings}
                            color="primary"
                            variant="contained"
                            className={styles.saveButton}
                        >
                            Lưu
                        </Button>
                    </Box>
                </DialogTitle>

                {/* Dialog Content */}
                <DialogContent className={styles.dialogContent}>
                    <Grid container spacing={5}>
                        {/* Cột trái: Tiêu đề & mô tả */}
                        <Grid size={8}>
                            <Typography variant="h6" className={styles.sectionTitle}>Tiêu đề</Typography>
                            <TextField
                                value={tempData.title}
                                onChange={(e) => setTempData({...tempData, title: e.target.value})}
                                variant="outlined"
                                fullWidth
                                placeholder="Nhập tiêu đề cho bộ câu hỏi"
                                className={styles.textField}
                            />
                            <Typography variant="h6" className={styles.sectionTitle}>Mô tả <span className={styles.optional}>(Không bắt buộc)</span></Typography>
                            <TextField
                                value={tempData.description}
                                onChange={(e) => setTempData({...tempData, description: e.target.value})}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Mô tả bộ câu hỏi của bạn..."
                                className={styles.textField}
                            />
                        </Grid>
                        {/* Ảnh bìa */}
                        <Grid size={4}>
                            <Typography variant="h6" className={styles.sectionTitle}>Ảnh bìa</Typography>
                            <Typography variant="body2" className={styles.sectionSubtitle}>Thêm ảnh bìa để làm nổi bật bộ câu hỏi.</Typography>
                            {/* Hình ảnh */}
                            <ImageUploadCard
                                imageUrl={tempData.image_url}
                                alt={quiz?.title}
                                onChange={(url, file) => {
                                    setTempData({...tempData, image_url: url});
                                    onQuestionSetImageChange?.( url, file);
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </AppBar>
    );
};

export default Topbar;