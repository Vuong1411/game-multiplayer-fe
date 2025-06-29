import { useState } from "react";

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Lưu ảnh lên Cloudinary
 * @returns url ảnh đã upload lên Cloudinary
 */
export function useCloudinaryUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * 
     * @param file File ảnh (gif, png, )
     * @returns 
     */
    const upload = async (file: File, folder?: string): Promise<string | undefined> => {
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET || "");
        if (folder) {
            formData.append("folder", folder);
        }

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();
            if (data.secure_url) {
                return data.secure_url as string;
            } else {
                setError("Upload thất bại!");
                return undefined;
            }
        } catch (err) {
            setError("Lỗi kết nối Cloudinary!");
            return undefined;
        } finally {
            setUploading(false);
        }
    };

    return { upload, uploading, error };
}