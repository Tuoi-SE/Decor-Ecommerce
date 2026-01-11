import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { Product } from '@/modules/product/domain/entities/product.entity';

@Entity('categories')
export class Category extends BaseEntity {
    @Column({ name: 'parent_id', nullable: true })
    @IsOptional()
    parentId: number;

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

    @Column({ name: 'image_url', nullable: true })
    @IsOptional()
    @IsString()
    imageUrl: string;

    @Column({ name: 'sort_order', default: 0 })
    @IsOptional()
    sortOrder: number;

    @Column({ name: 'is_active', default: true })
    @IsOptional()
    isActive: boolean;

    @ManyToOne(() => Category, (category) => category.children)
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
