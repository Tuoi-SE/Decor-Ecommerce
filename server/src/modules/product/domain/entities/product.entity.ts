import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { Category } from '@/modules/product/domain/entities/category.entity';
import { ProductImage } from './product-image.entity';
import { AttributeValue } from './attribute.entity';

@Entity('products')
export class Product extends BaseEntity {
    @Column({ name: 'category_id' })
    categoryId: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    slug: string;

    @Column('text', { name: 'short_description', nullable: true })
    @IsOptional()
    @IsString()
    shortDescription: string;

    @Column('text', { nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    @Column('decimal', { name: 'base_price', precision: 10, scale: 2 })
    @IsNotEmpty()
    basePrice: number;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    material: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    style: string;

    @Column('float', { nullable: true })
    @IsOptional()
    width: number;

    @Column('float', { nullable: true })
    @IsOptional()
    height: number;

    @Column('float', { nullable: true })
    @IsOptional()
    depth: number;

    @Column({ name: 'main_color', nullable: true })
    @IsOptional()
    @IsString()
    mainColor: string;

    @Column({ default: 'active' })
    @IsEnum(['active', 'inactive', 'draft'])
    status: string;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => ProductImage, (image) => image.product)
    images: ProductImage[];

    @ManyToMany(() => AttributeValue)
    @JoinTable({
        name: 'product_attribute_values',
        joinColumn: { name: 'product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'attribute_value_id', referencedColumnName: 'id' },
    })
    attributeValues: AttributeValue[];
}
