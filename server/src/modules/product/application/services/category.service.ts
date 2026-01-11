import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import defaultSlugify from 'slugify';
import { Category } from '../../domain/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dto';
import { UploadService } from '@/modules/upload/application/services/upload.service';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private readonly uploadService: UploadService,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const slug = defaultSlugify(createCategoryDto.name, { lower: true, strict: true });

        const existingCategory = await this.categoryRepository.findOne({ where: { slug } });
        if (existingCategory) {
            throw new ConflictException('Category with this name already exists');
        }

        if (createCategoryDto.parentId) {
            const parent = await this.categoryRepository.findOne({ where: { id: createCategoryDto.parentId } });
            if (!parent) {
                throw new NotFoundException(`Parent category with ID ${createCategoryDto.parentId} not found`);
            }
        }

        const newCategory = this.categoryRepository.create({
            ...createCategoryDto,
            slug,
        });

        const savedCategory = await this.categoryRepository.save(newCategory);
        return this.toResponseDto(savedCategory);
    }

    async findAll(query: any): Promise<CategoryResponseDto[]> {
        // Return tree structure or flat list?
        // Let's support both or just tree by default for categories usually rarely large
        // If 'tree=true' query param.
        // For now, let's return all.
        const categories = await this.categoryRepository.find({
            relations: ['children'], // 1-level children for now. For deep tree, prefer TreeRepository but current entity is simple.
            order: { sortOrder: 'ASC' },
            where: { parentId: IsNull() } // Get root categories, children loaded via relation
        });

        // However, standard findAll usually lists all.
        // Let's just list roots with children for a nice menu structure.
        return categories.map(cat => this.toResponseDto(cat));
    }

    async findAllFlat(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoryRepository.find({
            order: { sortOrder: 'ASC' }
        });
        return categories.map(cat => this.toResponseDto(cat));
    }

    async findOne(id: number): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['children', 'parent']
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return this.toResponseDto(category);
    }

    async findBySlug(slug: string): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.findOne({
            where: { slug },
            relations: ['children', 'parent']
        });

        if (!category) {
            throw new NotFoundException(`Category with slug ${slug} not found`);
        }

        return this.toResponseDto(category);
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const slug = defaultSlugify(updateCategoryDto.name, { lower: true, strict: true });
            const existing = await this.categoryRepository.findOne({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new ConflictException('Category name already taken');
            }
            category.slug = slug;
        }

        if (updateCategoryDto.parentId) {
            if (updateCategoryDto.parentId === id) {
                throw new ConflictException('Category cannot be its own parent');
            }
            const parent = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentId } });
            if (!parent) {
                throw new NotFoundException(`Parent category with ID ${updateCategoryDto.parentId} not found`);
            }
        }

        Object.assign(category, updateCategoryDto);
        const updatedCategory = await this.categoryRepository.save(category);
        return this.toResponseDto(updatedCategory);
    }

    async remove(id: number): Promise<void> {
        // Need to check if it has products or children?
        // simple soft delete for now.
        const result = await this.categoryRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        // Note: We do NOT delete the image on soft delete to allow restoration.
    }

    private toResponseDto(category: Category): CategoryResponseDto {
        return new CategoryResponseDto({
            id: category.id,
            name: category.name,
            slug: category.slug, // Missing in DTO? Added.
            description: category.description,
            imageUrl: category.imageUrl,
            parentId: category.parentId,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            children: category.children ? category.children.map(c => this.toResponseDto(c)) : [],
        });
    }
}
