import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const GameLayout = () => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default',
            overflow: 'hidden'
        }}>
            <Outlet />
        </Box>
    );
};

export default GameLayout;