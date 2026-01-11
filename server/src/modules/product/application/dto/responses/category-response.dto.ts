import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
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
    description: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    @ApiProperty()
    @Expose()
    parentId: number;

    @ApiProperty({ type: () => CategoryResponseDto })
    @Expose()
    @Type(() => CategoryResponseDto)
    children: CategoryResponseDto[];

    @ApiProperty()
    @Expose()
    sortOrder: number;

    @ApiProperty()
    @Expose()
    isActive: boolean;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<CategoryResponseDto>) {
        Object.assign(this, partial);
    }
}
