import { Cloudinary } from "@cloudinary/url-gen";

export const CLOUDINARY_CONFIG = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    apiUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
};

export const cld = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_CONFIG.cloudName
    }
});