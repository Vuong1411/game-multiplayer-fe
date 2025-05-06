import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// @project
import theme from './theme';
import { MainLayout, GameLayout } from './components/layout';
import Home  from './pages/Home';
import Library from './pages/Library';
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
                <Route element={<GameLayout />}>
                </Route> 
            </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
