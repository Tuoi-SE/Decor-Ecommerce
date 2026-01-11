import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
    async uploadImage(file: Express.Multer.File, type: string): Promise<any> {
        let folder = 'decor-shop/others';

        switch (type) {
            case 'avatar':
                folder = 'decor-shop/avatars';
                break;
            case 'product':
                folder = 'decor-shop/products';
                break;
            case 'banner':
                folder = 'decor-shop/banners';
                break;
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image', // explicit
                    // unique_filename: true, // default
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

    extractPublicIdFromUrl(url: string): string | null {
        // Example URL: https://res.cloudinary.com/demo/image/upload/v1/decor-shop/avatars/sample.jpg
        // Public ID: decor-shop/avatars/sample
        const regex = /\/v\d+\/(.+)\.[a-z]+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}
