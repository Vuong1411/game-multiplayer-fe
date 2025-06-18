import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/app';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;