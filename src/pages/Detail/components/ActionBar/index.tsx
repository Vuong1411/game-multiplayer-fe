import { Box, Typography, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LinkIcon from '@mui/icons-material/Link';
// Custom icons
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SendIcon from '@mui/icons-material/Send';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
// @project
import styles from './styles.module.scss';

interface ActionBarProps {
    onCreateRoom?: () => void;

}

const ActionBar = ({onCreateRoom}: ActionBarProps) => {
    return (
        <Box className={styles.actionBarContainer}>
            {/* Phiên kahoot */}
            <Typography variant="subtitle1" className={styles.sectionTitle}>
                Phiên kahoot
            </Typography>

            <Box className={styles.sectionButton}>
                <Button className={styles.button} fullWidth onClick={onCreateRoom}>
                    <Box className={styles.buttonContent}>
                        <LiveTvIcon className={styles.actionIcon} />
                        <Typography className={styles.buttonText}>Tổ chức live</Typography>
                        <ChevronRightIcon className={styles.chevronIcon} />
                    </Box>
                </Button>

                <Button className={styles.button} fullWidth>
                    <Box className={styles.buttonContent}>
                        <SendIcon className={styles.actionIcon} />
                        <Typography className={styles.buttonText}>Giao</Typography>
                        <ChevronRightIcon className={styles.chevronIcon} />
                    </Box>
                </Button>
            </Box>


            {/* Tự học kahoot */}
            <Typography variant="subtitle1" className={styles.sectionTitle}>
                Tự học kahoot
            </Typography>

            <Box className={styles.sectionButton}>
                <Button className={styles.button} fullWidth>
                    <Box className={styles.buttonContent}>
                        <PlayLessonIcon className={styles.actionIcon} />
                        <Typography className={styles.buttonText}>Học tập</Typography>
                        <ChevronRightIcon className={styles.chevronIcon} />
                    </Box>
                </Button>

                <Button className={styles.button} fullWidth onClick={onCreateRoom}>
                    <Box className={styles.buttonContent}>
                        <SportsEsportsIcon className={styles.actionIcon} />
                        <Typography className={styles.buttonText}>Chơi cá nhân</Typography>
                        <ChevronRightIcon className={styles.chevronIcon} />
                    </Box>
                </Button>
            </Box>

            {/* Footer Information */}
            <Box className={styles.sectionFooter}>
                <Typography variant="body2" className={styles.footerText}>
                    Tối đa {40} người tham gia.
                </Typography>

                <a href='/update' className={styles.upgradeLink}>
                    <LinkIcon className={styles.linkIcon} />
                    <span>Nâng cấp để có nhiều tính năng khác</span>
                </a>
            </Box>
        </Box>
    );
};

export default ActionBar;