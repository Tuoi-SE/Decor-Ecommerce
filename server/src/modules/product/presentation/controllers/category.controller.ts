import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../application/dto';
import { Public, Roles } from '@/shared/decorators';
import { UserRole } from '@/shared/enums';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category successfully created' })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all categories (Tree structure usually)' })
    async findAll(@Query() query: any) {
        if (query.flat === 'true') {
            return this.categoryService.findAllFlat();
        }
        return this.categoryService.findAll(query);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    async findOne(@Param('id') id: string) {
        return this.categoryService.findOne(+id);
    }

    @Public()
    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get category by Slug' })
    async findBySlug(@Param('slug') slug: string) {
        return this.categoryService.findBySlug(slug);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update category' })
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(+id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete category' })
    async remove(@Param('id') id: string) {
        return this.categoryService.remove(+id);
    }
}
