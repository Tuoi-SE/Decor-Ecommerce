import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Product, ProductImage, Attribute, AttributeValue } from './domain/entities';

import { ProductController } from './presentation/controllers/product.controller';
import { ProductService } from './application/services/product.service';
import { CategoryController } from './presentation/controllers/category.controller';
import { CategoryService } from './application/services/category.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category,
            Product,
            ProductImage,
            Attribute,
            AttributeValue,
        ]),
    ],
    controllers: [ProductController, CategoryController],
    providers: [ProductService, CategoryService],
    exports: [TypeOrmModule, ProductService, CategoryService],
})
export class ProductModule { }
