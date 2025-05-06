import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';

interface PlusCardProps {
    onClick?: () => void;
}

const PlusCard = ({ onClick }: PlusCardProps) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                minWidth: 200,
                maxWidth: 200,
                height: 253,
                border: '2px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-4px)'
                }
            }}
        >
            <Add sx={{ color: '#888', fontSize: 32 }} />
        </Box>
    );
};

export default PlusCard;