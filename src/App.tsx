import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// @project
import theme from './theme';
import { MainLayout } from './components/layout';
import Home  from './pages/Home';
import Library from './pages/Library';
import Creator from './pages/Creator';
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/library" element={<Library />} />
                </Route>
                <Route path="/creator" element={<Creator />} />
            </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
