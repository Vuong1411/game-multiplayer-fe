// hooks/useDialog.ts
import { useState, useCallback } from 'react';
import { CommonDialogProps } from '@project/components/common/Dialog';

interface DialogConfig extends Omit<CommonDialogProps, 'open' | 'onClose'> {}

export const useDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<DialogConfig>({
        title: '',
        message: ''
    });

    // Show dialog with config
    const showDialog = useCallback((dialogConfig: DialogConfig) => {
        setConfig(dialogConfig);
        setIsOpen(true);
    }, []);

    // Close dialog
    const closeDialog = () => {
        setIsOpen(false);
    };

    // Quick methods
    const showError = (message: string, title = 'Lỗi', options?: Partial<DialogConfig>) => {
        showDialog({
            type: 'error',
            title,
            message,
            primaryButton: {
                label: 'OK',
                onClick: closeDialog,
                color: 'error'
            },
            ...options
        });
    };

    const showSuccess = (message: string, title = 'Thành công', options?: Partial<DialogConfig>) => {
        showDialog({
            type: 'success',
            title,
            message,
            primaryButton: {
                label: 'OK',
                onClick: closeDialog,
                color: 'success'
            },
            ...options
        });
    };

    const showConfirm = (
        message: string, 
        onConfirm: () => void, 
        title = 'Xác nhận',
        options?: Partial<DialogConfig>
    ) => {
        showDialog({
            type: 'warning',
            title,
            message,
            primaryButton: {
                label: 'Xác nhận',
                onClick: () => {
                    onConfirm();
                    closeDialog();
                },
                color: 'primary'
            },
            secondaryButton: {
                label: 'Hủy',
                onClick: closeDialog
            },
            closable: false,
            ...options
        });
    };

    // Return props cho Dialog component
    const dialogProps: CommonDialogProps = {
        ...config,
        open: isOpen,
        onClose: closeDialog
    };

    return {
        dialogProps,
        showDialog,
        showError,
        showSuccess,
        showConfirm,
        closeDialog,
        isOpen
    };
};