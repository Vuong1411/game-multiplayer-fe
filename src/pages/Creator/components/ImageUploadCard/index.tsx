import React, { useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MoodIcon from '@mui/icons-material/Mood';
import MovieIcon from '@mui/icons-material/Movie';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
// @project
import styles from './styles.module.scss';

interface ImageUploadCardProps {
    imageUrl?: string | null;
    alt?: string;
    onChange: (url: string | undefined, file?: File) => void;
}

const ImageUploadCard = ({ imageUrl, alt = '', onChange: onImageChange }: ImageUploadCardProps) => {
    const normalizedImageUrl = imageUrl === undefined ? null : imageUrl;
    // Hàm xử lý khi người dùng chọn tệp tin
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File ảnh quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
            return;
        }

        try {
            const fileUrl = URL.createObjectURL(file);
            onImageChange(fileUrl, file);
        } catch (error) {
            console.error("Error processing file:", error);
        }
    }, [onImageChange]);

    // Kéo thả tệp tin vào vùng upload
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    // Hàm xử lý khi người dùng thả tệp tin vào vùng upload
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }
        
        try {
            // Tạo URL cho tệp tin trên localStorage
            const fileUrl = URL.createObjectURL(file);
            onImageChange(fileUrl, file);
        } catch (error) {
            console.error("Error processing dropped file:", error);
        }
    }, [onImageChange]);

    // Hàm xử lý khi người dùng xóa ảnh
    const handleDelete = useCallback(() => {
        // Cleanup blob URL nếu có
        if (imageUrl && imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl);
        }

        onImageChange(undefined, undefined);
    }, [onImageChange, imageUrl]);

    return (
        <Box className={styles.imageContainer}>
            {normalizedImageUrl ? (
                <Box className={styles.imageWrapper}>
                    <img
                        src={normalizedImageUrl}
                        alt={alt}
                        className={styles.questionImage}
                    />

                    {/* Các nút công cụ */}
                    <Box className={styles.imageTools}>
                        <Box
                            className={styles.toolButton}
                            onClick={handleDelete}
                        >
                            <DeleteForeverIcon fontSize="small" className={styles.toolIcon} />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box 
                    className={styles.uploadContainer}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {/* Upload icons */}
                    <Box className={styles.uploadIcons}>
                        <InsertPhotoIcon className={styles.mediaIcon} />
                        <MoodIcon className={styles.mediaIcon} />
                        <MovieIcon className={styles.mediaIcon} />
                        <AudiotrackIcon className={styles.mediaIcon} />
                    </Box>

                    {/* Upload button */}
                    <Box className={styles.plusButton}>
                        <AddIcon />
                    </Box>

                    {/* Text */}
                    <Typography className={styles.uploadTitle}>
                        Tìm và chèn phương tiện truyền thông
                    </Typography>

                    {/* Upload options */}
                    <Box className={styles.uploadOptions}>
                        <Button
                            component="label"
                            className={styles.uploadButton}
                        >
                            Tải tệp tin lên
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </Button>
                        <Typography className={styles.uploadOr}>
                            hoặc kéo vào đây để tải lên
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ImageUploadCard;