import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductService } from '../../application/services/product.service';
import { CreateProductDto, UpdateProductDto } from '../../application/dto';
import { Public, Roles } from '@/shared/decorators';
import { JwtAuthGuard, RolesGuard } from '@/core/guards';
import { UserRole } from '@/shared/enums';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product successfully created' })
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findAll(@Query() query: any) {
        return this.productService.findAll(query);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    async findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    @Public()
    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get product by Slug' })
    async findBySlug(@Param('slug') slug: string) {
        return this.productService.findBySlug(slug);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update product' })
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete product' })
    async remove(@Param('id') id: string) {
        return this.productService.remove(+id);
    }
}
