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
    onImageChange: (url: string | undefined) => void;
}

const ImageUploadCard = ({ imageUrl, alt = '', onImageChange }: ImageUploadCardProps) => {
    // Hàm xử lý khi người dùng chọn tệp tin
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileUrl = URL.createObjectURL(file);
            onImageChange(fileUrl);
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
        
        try {
            // Tạo URL cho tệp tin trên localStorage
            const fileUrl = URL.createObjectURL(file);
            onImageChange(fileUrl);
        } catch (error) {
            console.error("Error processing dropped file:", error);
        }
    }, [onImageChange]);

    // Hàm xử lý khi người dùng xóa ảnh
    const handleDelete = useCallback(() => {
        onImageChange(undefined);
    }, [onImageChange]);

    return (
        <Box className={styles.imageContainer}>
            {imageUrl ? (
                <Box className={styles.imageWrapper}>
                    <img
                        src={imageUrl}
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