import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product, Category } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        if (createProductDto.sku) {
            const existingSku = await this.prisma.product.findUnique({
                where: { sku: createProductDto.sku }
            });
            if (existingSku) {
                throw new ConflictException(`Product with SKU "${createProductDto.sku}" already exists`);
            }
        }

        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                sku: createProductDto.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                price: new Prisma.Decimal(createProductDto.price),
            },
            include: {
                category: true,
            }
        });

        return this.formateProduct(product as any);
    }

    // get all products
    async findAll(queryDto: QueryProductDto): Promise<{
        data: ProductResponseDto[],
        meta: { total: number, page: number, limit: number, totalPage: number }
    }> {
        const { category, isActive, limit = 10, page = 1, search, sortBy, sortOrder, minPrice, maxPrice } = queryDto;

        const where: Prisma.ProductWhereInput = {};

        if (category) {
            where.categoryId = category;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = new Prisma.Decimal(minPrice);
            }
            if (maxPrice !== undefined) {
                where.price.lte = new Prisma.Decimal(maxPrice);
            }
        }

        const total = await this.prisma.product.count({ where });

        const orderByKey = sortBy || 'createdAt';
        const orderByOrder = sortOrder || 'desc';
        const orderBy: any = {};
        orderBy[orderByKey] = orderByOrder;

        const products = await this.prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            include: {
                category: true,
            },
        });

        return {
            data: products.map((product) => this.formateProduct(product as any)),
            meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
        };
    }

    // get product by id
    async findOne(id: string): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return this.formateProduct(product as any);
    }

    // update product
    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }

        if (updateProductDto.sku) {
            const existingSku = await this.prisma.product.findFirst({
                where: {
                    sku: updateProductDto.sku,
                    NOT: { id }
                }
            });
            if (existingSku) {
                throw new ConflictException(`Product with SKU "${updateProductDto.sku}" already exists`);
            }
        }

        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                ...updateProductDto,
                price: updateProductDto.price ? new Prisma.Decimal(updateProductDto.price) : undefined,
            },
            include: {
                category: true,
            }
        });

        return this.formateProduct(updated as any);
    }

    private formateProduct(product: Product & { category: Category }): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            stock: product.stock,
            sku: product.sku,
            imageUrl: product.imageUrl,
            isActive: product.isActive,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            category: product.category.name,
            categoryName: product.category.name,
        };
    }
}
