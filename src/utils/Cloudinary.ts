import { CLOUDINARY_CONFIG } from '@project/config/cloudinary.config';

export const uploadToCloudinary = async (file: File, folder: string): Promise<string | undefined> => {
    const { uploadPreset, apiUrl } = CLOUDINARY_CONFIG;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset || "");
    if (folder) formData.append("folder", folder);
    const res = await fetch(
        apiUrl,
        { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url as string | undefined;
};