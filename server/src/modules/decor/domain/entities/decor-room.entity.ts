import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { Product } from '@/modules/product/domain/entities/product.entity';

@Entity('decor_rooms')
@Entity('decor_rooms')
export class DecorRoom extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    slug: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    style: string;

    @Column('text', { nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    @Column({ name: 'thumbnail_url', nullable: true })
    @IsOptional()
    @IsString()
    thumbnailUrl: string;

    @Column({ name: 'is_active', default: true })
    @IsOptional()
    isActive: boolean;

    @ManyToMany(() => Product)
    @JoinTable({
        name: 'decor_room_products',
        joinColumn: { name: 'decor_room_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
    })
    products: Product[];
}
