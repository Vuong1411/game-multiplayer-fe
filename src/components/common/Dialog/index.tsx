import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box
} from '@mui/material';

export interface CommonDialogProps {
    open: boolean;
    onClose?: () => void;
    title: string;
    message: string;
    description?: string;
    icon?: React.ReactNode;
    tip?: string;
    primaryButton?: {
        label: string;
        onClick: () => void;
        color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    };
    secondaryButton?: {
        label: string;
        onClick: () => void;
    };
    type?: 'error' | 'warning' | 'info' | 'success';
    closable?: boolean;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
    open,
    onClose,
    title,
    message,
    description,
    icon,
    tip,
    primaryButton,
    secondaryButton,
    type = 'info',
    closable = true
}) => {
    const getGradientByType = () => {
        switch (type) {
            case 'error':
                return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
            case 'warning':
                return 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
            case 'success':
                return 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
            case 'info':
            default:
                return 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)';
        }
    };

    const getTipStyles = () => {
        switch (type) {
            case 'error':
                return { background: '#ffebee', border: '1px solid #ffcdd2' };
            case 'warning':
                return { background: '#fff3cd', border: '1px solid #ffeaa7' };
            case 'success':
                return { background: '#e8f5e8', border: '1px solid #c8e6c9' };
            case 'info':
            default:
                return { background: '#e3f2fd', border: '1px solid #bbdefb' };
        }
    };

    return (
        <Dialog
            open={open}
            onClose={closable ? onClose : undefined}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    textAlign: 'center'
                }
            }}
        >
            <DialogTitle
                component="div"
                sx={{
                    background: getGradientByType(),
                    color: 'white',
                    py: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                }}>
                {icon}
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2, color: '#333' }}>
                    {message}
                </Typography>

                {description && (
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                        {description}
                    </Typography>
                )}

                {tip && (
                    <Box sx={{
                        ...getTipStyles(),
                        borderRadius: 2,
                        p: 2,
                        mt: 2
                    }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            💡 <strong>Gợi ý:</strong> {tip}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                {secondaryButton && (
                    <Button
                        variant="outlined"
                        onClick={secondaryButton.onClick}
                        sx={{ minWidth: 120 }}
                    >
                        {secondaryButton.label}
                    </Button>
                )}

                {primaryButton && (
                    <Button
                        variant="contained"
                        onClick={primaryButton.onClick}
                        color={primaryButton.color || 'primary'}
                        sx={{ minWidth: 120 }}
                    >
                        {primaryButton.label}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CommonDialog;