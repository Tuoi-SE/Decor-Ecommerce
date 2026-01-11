import { Controller, Post, UseInterceptors, UploadedFile, Headers, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiHeader, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UploadService } from '../../application/services/upload.service';
import { JwtAuthGuard } from '@/core/guards';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @ApiOperation({ summary: 'Upload image to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiHeader({
        name: 'x-image-type',
        description: 'Type of image (avatar, product, banner)',
        required: false,
        schema: { default: 'others', enum: ['avatar', 'product', 'banner'] }
    })
    @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Headers('x-image-type') imageType: string = 'others'
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.uploadService.uploadImage(file, imageType);
    }
}
