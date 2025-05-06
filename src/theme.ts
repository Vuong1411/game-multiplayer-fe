import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    // Cấu hình kiểu chữ
    typography: {
        fontFamily: 'Montserrat, "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, "Bai Jamjuree", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        subtitle1: {
            fontSize: '1.125rem',
            fontWeight: 500,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    // Cấu hình màu sắc
    palette: {
        primary: {
            main: '#646cff',
            light: '#747bff',
            dark: '#535bf2',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#9747FF',
            light: '#B47EFF',
            dark: '#7E3FCC',
            contrastText: '#ffffff',
        },
        error: {
            main: '#dc3545',
            light: '#e35d6a',
            dark: '#b02a37',
        },
        warning: {
            main: '#ffc107',
            light: '#ffcd39',
            dark: '#cc9a06',
        },
        success: {
            main: '#198754',
            light: '#27a567',
            dark: '#146c43',
        },
        info: {
            main: '#0dcaf0',
            light: '#3dd5f3',
            dark: '#0aa2c0',
        },
        background: {
            default: '#ffffff',
            paper: '#f8f9fa',
        },
        text: {
            primary: '#213547',
            secondary: '#6c757d',
            disabled: '#adb5bd',
        },
    },
    // Cấu hình hình dạng
    shape: {
        borderRadius: 8,
    },
    // Cấu hình components
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
    },
});

export default theme;