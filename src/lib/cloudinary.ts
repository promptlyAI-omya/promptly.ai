import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file: string, folder: string = 'prompty-ai') {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
        });
        return result;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
}
