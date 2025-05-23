import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// @project
import theme from './theme';
import { MainLayout } from './components/layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Creator from './pages/Creator';
import Detail from './pages/Detail';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/details/:id" element={<Detail />} />
                </Route>
                <Route path="/creator" element={<Creator />} />
                <Route path="/creator/:id" element={<Creator />} />
            </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
