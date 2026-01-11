import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './presentation/controllers/upload.controller';
import { UploadService } from './application/services/upload.service';
import { CloudinaryProvider } from './infrastructure/provider/cloudinary.provider';

@Module({
    imports: [ConfigModule],
    controllers: [UploadController],
    providers: [CloudinaryProvider, UploadService],
    exports: [UploadService, CloudinaryProvider],
})
export class UploadModule { }
