import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import defaultSlugify from 'slugify';
import { Product } from '../../domain/entities/product.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto';
import { UploadService } from '@/modules/upload/application/services/upload.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private productImageRepository: Repository<ProductImage>,
        private readonly uploadService: UploadService,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        const slug = defaultSlugify(createProductDto.name, { lower: true, strict: true });

        // Check if slug exists
        const existingProduct = await this.productRepository.findOne({ where: { slug } });
        if (existingProduct) {
            throw new ConflictException('Product with this name already exists (slug conflict)');
        }

        const { images, ...productData } = createProductDto;

        const newProduct = this.productRepository.create({
            ...productData,
            slug,
        });

        const savedProduct = await this.productRepository.save(newProduct);

        if (images && images.length > 0) {
            const productImages = images.map((url, index) => {
                return this.productImageRepository.create({
                    productId: savedProduct.id,
                    imageUrl: url,
                    isPrimary: index === 0,
                    sortOrder: index,
                });
            });
            await this.productImageRepository.save(productImages);
            // Reload product with images
            savedProduct.images = productImages;
        } else {
            savedProduct.images = [];
        }

        return this.toResponseDto(savedProduct);
    }

    async findAll(query: any): Promise<{ data: ProductResponseDto[], total: number, page: number, limit: number }> {
        // Basic pagination
        const page = query.page ? parseInt(query.page) : 1;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const skip = (page - 1) * limit;

        const [products, total] = await this.productRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['category', 'images']
        });

        return {
            data: products.map(product => this.toResponseDto(product)),
            total,
            page,
            limit
        };
    }

    async findOne(id: number): Promise<ProductResponseDto> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'images', 'attributeValues'] // Add attributeValues if needed
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.toResponseDto(product);
    }

    async findBySlug(slug: string): Promise<ProductResponseDto> {
        const product = await this.productRepository.findOne({
            where: { slug },
            relations: ['category', 'images', 'attributeValues']
        });

        if (!product) {
            throw new NotFoundException(`Product with slug ${slug} not found`);
        }

        return this.toResponseDto(product);
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['images']
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        if (updateProductDto.name && updateProductDto.name !== product.name) {
            const slug = defaultSlugify(updateProductDto.name, { lower: true, strict: true });
            // Check collision
            const existing = await this.productRepository.findOne({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new ConflictException('Product name already taken');
            }
            product.slug = slug;
        }

        // Handle Image Update? For now just handle basic fields.
        // Supporting full image replacement is tricky with just an array update.
        // Usually dedicated endpoints like POST /products/:id/images or DELETE /products/:id/images/:imageId are better.
        // But if user sends `images` in update, we could replace all?
        // Let's defer complex image update logic and stick to properties update.
        // If users want to update images via PUT/PATCH, request logic is needed.
        // Given current prompt scope, I'll focus on just returning the DTO and updating basics.

        Object.assign(product, updateProductDto);
        const updatedProduct = await this.productRepository.save(product);
        return this.toResponseDto(updatedProduct);
    }

    async remove(id: number): Promise<void> {
        // Find product first to delete images from cloud?
        // Soft delete means we keep them.
        const result = await this.productRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    private toResponseDto(product: Product): ProductResponseDto {
        return new ProductResponseDto({
            ...product,
            images: product.images ? product.images.map(img => ({
                id: img.id,
                imageUrl: img.imageUrl,
                isPrimary: img.isPrimary,
                sortOrder: img.sortOrder
            })) : []
        });
    }
}
