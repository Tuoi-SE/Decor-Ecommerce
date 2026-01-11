import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { Product } from '@/modules/product/domain/entities/product.entity';

@Entity('product_images')
export class ProductImage extends BaseEntity {
    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'image_url' })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @Column({ name: 'is_primary', default: false })
    @IsOptional()
    isPrimary: boolean;

    @Column({ name: 'sort_order', default: 0 })
    @IsOptional()
    sortOrder: number;

    @ManyToOne(() => Product, (product) => product.images)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
