import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductImageResponseDto {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    @ApiProperty()
    @Expose()
    isPrimary: boolean;

    @ApiProperty()
    @Expose()
    sortOrder: number;
}

export class ProductResponseDto {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    slug: string;

    @ApiProperty()
    @Expose()
    categoryId: number;

    @ApiProperty()
    @Expose()
    shortDescription: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    basePrice: number;

    @ApiProperty()
    @Expose()
    material: string;

    @ApiProperty()
    @Expose()
    style: string;

    @ApiProperty()
    @Expose()
    width: number;

    @ApiProperty()
    @Expose()
    height: number;

    @ApiProperty()
    @Expose()
    depth: number;

    @ApiProperty()
    @Expose()
    mainColor: string;

    @ApiProperty()
    @Expose()
    status: string;

    @ApiProperty({ type: () => [ProductImageResponseDto] })
    @Expose()
    @Type(() => ProductImageResponseDto)
    images: ProductImageResponseDto[];

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<ProductResponseDto>) {
        Object.assign(this, partial);
    }
}
