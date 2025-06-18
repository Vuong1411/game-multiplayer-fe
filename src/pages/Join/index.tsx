import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Typography,
    Box,
    Snackbar,
    Alert,
    Card,
    CardContent
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
// @project
import styles from './styles.module.scss';
import { roomService } from '@project/services';

const Join = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Hàm xử lý khi người dùng nhập PIN
    const handleJoinRoom = async () => {
        if (!pin.trim()) {
            setError('Vui lòng nhập mã PIN');
            return;
        }
        
        setIsLoading(true);
        setError(null);

        try {
            // Gọi API để kiểm tra PIN và lấy thông tin phòng
            const roomData = await roomService.getByPin(pin.trim());
            
            if (roomData) {
                // Chuyển hướng đến trang lobby với thông tin phòng
                navigate(`/lobby/live/${roomData.id}`, {
                    state: {
                        pin: pin.trim(),
                        isHost: false
                    }
                });
            } else {
                setError('Mã PIN không hợp lệ hoặc phòng không tồn tại!');
            }
        } catch (error: any) {
            console.error('Failed to join room:', error);
            setError(error.message || 'Không thể tham gia phòng. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý khi nhấn Enter
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleJoinRoom();
        }
    };

    return (
        <Box className={styles.joinContainer}>
            {/* Top Bar */}
            <Box className={styles.topBar}>
                <Box onClick={() => navigate('/')} className={styles.homeButton}>
                    <HomeIcon fontSize="small" />
                </Box>
                
                <Box className={styles.topRightControls}>
                    <Button variant="contained" size="small" className={styles.languageButton} sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
                        VI
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box className={styles.mainContentArea}>
                <Typography variant="h1" className={styles.branding}>
                    QUIZ!
                </Typography>

                <Card className={styles.joinCard}>
                    <CardContent className={styles.joinCardContent}>

                       <TextField
                            label="Mã PIN trò chơi"
                            value={pin}
                            onChange={(e) => {
                                setPin(e.target.value);
                                if (error) setError(null);
                            }}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            fullWidth
                            error={!!error}
                            disabled={isLoading}
                        />

                        <Button
                            variant="contained"
                            onClick={handleJoinRoom}
                            disabled={!pin.trim() || isLoading}
                        >
                            {isLoading ? 'Đang kết nối...' : 'Tham gia!'}
                        </Button>
                    </CardContent>
                </Card>
            </Box>

            {/* Snackbar for errors */}
            <Snackbar
                open={!!error}
                autoHideDuration={5000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setError(null)}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Join;