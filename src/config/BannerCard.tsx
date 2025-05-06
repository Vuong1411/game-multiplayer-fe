import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { School } from '@mui/icons-material';
import promoImg from '../../../assets/images/banner.png';

const PromoBannerCard = () => {
    return (
        <Card
            sx={{
                background: 'linear-gradient(45deg, #FF3366 30%, #FF9933 90%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mx: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
        >
            {/* Decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                }}
            />
            
            <CardContent sx={{ py: { xs: 4, md: 6 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 4
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '1.75rem', md: '2.5rem' }
                            }}
                        >
                            Nâng cao trải nghiệm học tập của bạn!
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 400,
                                mb: 3,
                                opacity: 0.9
                            }}
                        >
                            Đăng ký ngay hôm nay để truy cập không giới hạn các tính năng cao cấp
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<School />}
                            sx={{
                                bgcolor: 'white',
                                color: '#FF3366',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                },
                                px: 4,
                                py: 1.5,
                                fontWeight: 600
                            }}
                        >
                            Nâng cấp ngay
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            position: 'relative',
                            width: { xs: '100%', md: '40%' },
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            component="img"
                            src={promoImg}
                            alt="Promo"
                            sx={{
                                maxWidth: '100%',
                                height: 'auto',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PromoBannerCard;