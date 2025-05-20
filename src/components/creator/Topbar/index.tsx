import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    TextField,
} from '@mui/material';

import styles from './styles.module.scss';
import logo from '../../../assets/logo.png';
import { QuestionSet } from '../../../types/question';

export interface TopbarProps {
    quiz: QuestionSet[];
}

const Topbar = () => {
    const navigate = useNavigate();

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
                    <Box className={styles.settingsGroup}>
                        {/* Tiêu đề */}
                        <TextField
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
                    >
                        Lưu
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;