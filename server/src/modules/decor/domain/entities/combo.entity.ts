import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { Product } from '@/modules/product/domain/entities/product.entity';

@Entity('combos')
@Entity('combos')
export class Combo extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    slug: string;

    @Column('text', { nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    @Column({ name: 'thumbnail_url', nullable: true })
    @IsOptional()
    @IsString()
    thumbnailUrl: string;

    @Column({ name: 'combo_type', default: 'fixed' })
    @IsEnum(['fixed', 'dynamic'])
    comboType: string;

    @Column({ name: 'discount_type', default: 'percentage' })
    @IsEnum(['percentage', 'fixed_amount'])
    discountType: string;

    @Column('decimal', { name: 'discount_value', precision: 10, scale: 2, default: 0 })
    @IsNotEmpty()
    discountValue: number;

    @Column({ name: 'is_active', default: true })
    @IsOptional()
    isActive: boolean;

    @ManyToMany(() => Product)
    @JoinTable({
        name: 'combo_products',
        joinColumn: { name: 'combo_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
    })
    products: Product[];
}
