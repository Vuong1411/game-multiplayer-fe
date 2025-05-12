import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { School } from '@mui/icons-material';

import styles from './styles.module.scss';
import promoImg from '../../../assets/images/banner.png';

const PromoBannerCard = () => {
    return (
        <Card className={styles.card}>
            <Box className={styles.decorativeCircle} />
            
            <CardContent className={styles.content}>
                <Box className={styles.contentWrapper}>
                    <Box className={styles.textSection}>
                        <Typography
                            variant="h4"
                            className={styles.title}
                        >
                            Nâng cao trải nghiệm học tập của bạn!
                        </Typography>
                        <Typography
                            variant="h6"
                            className={styles.subtitle}
                        >
                            Đăng ký ngay hôm nay để truy cập không giới hạn các tính năng cao cấp
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<School />}
                            className={styles.button}
                        >
                            Nâng cấp ngay
                        </Button>
                    </Box>

                    <Box className={styles.imageSection}>
                        <Box
                            component="img"
                            src={promoImg}
                            alt="Promo"
                            className={styles.image}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PromoBannerCard;