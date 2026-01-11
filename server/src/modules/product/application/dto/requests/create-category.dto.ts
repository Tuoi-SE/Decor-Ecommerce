import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Living Room', description: 'Name of the category' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Furniture for living room', description: 'Description of the category' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'https://...', description: 'Image URL of the category' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ example: null, description: 'ID of the parent category (if any)' })
    @IsOptional()
    @IsNumber()
    parentId?: number;

    @ApiPropertyOptional({ example: 0, description: 'Sort order of the category' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @ApiPropertyOptional({ example: true, description: 'Is the category active?' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;
}
