import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider: Provider = {
    provide: 'CLOUDINARY',
    useFactory: (configService: ConfigService) => {
        const cloudinaryUrl = configService.get<string>('CLOUDINARY_URL');
        if (cloudinaryUrl) {
            const regex = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/;
            const match = cloudinaryUrl.match(regex);
            if (match) {
                return cloudinary.config({
                    cloud_name: match[3],
                    api_key: match[1],
                    api_secret: match[2],
                });
            }
        }
        return cloudinary.config({
            cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    },
    inject: [ConfigService],
};
