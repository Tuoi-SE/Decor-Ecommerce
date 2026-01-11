import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 1, description: 'ID of the category' })
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @ApiProperty({ example: 'Modern Sofa', description: 'Name of the product' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'A comfortable modern sofa...', description: 'Short description' })
    @IsOptional()
    @IsString()
    shortDescription?: string;

    @ApiPropertyOptional({ example: 'Full description content...', description: 'Detailed description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 5000000, description: 'Base price of the product' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    basePrice: number;

    @ApiPropertyOptional({ example: 'Wood', description: 'Material of the product' })
    @IsOptional()
    @IsString()
    material?: string;

    @ApiPropertyOptional({ example: 'Modern', description: 'Style of the product' })
    @IsOptional()
    @IsString()
    style?: string;

    @ApiPropertyOptional({ example: 200, description: 'Width in cm' })
    @IsOptional()
    @IsNumber()
    width?: number;

    @ApiPropertyOptional({ example: 100, description: 'Height in cm' })
    @IsOptional()
    @IsNumber()
    height?: number;

    @ApiPropertyOptional({ example: 90, description: 'Depth in cm' })
    @IsOptional()
    @IsNumber()
    depth?: number;

    @ApiPropertyOptional({ example: 'Brown', description: 'Main color' })
    @IsOptional()
    @IsString()
    mainColor?: string;

    @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'draft'] })
    @IsOptional()
    @IsEnum(['active', 'inactive', 'draft'])
    status?: string = 'active';

    @ApiPropertyOptional({ example: ['https://...', 'https://...'], description: 'List of image URLs' })
    @IsOptional()
    @IsString({ each: true })
    images?: string[];
}
