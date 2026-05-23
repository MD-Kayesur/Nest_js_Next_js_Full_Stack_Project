import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product, Category } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto';


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
                price: new Prisma.Decimal(createProductDto.price),
            },
            include: {
                category: true,
            }
        });

        return this.formateProduct(product);
   }


   //get all products
   async findAll(queryDto: QueryProductDto): Promise<{
    data: ProductResponseDto[],
    meta: { total: number, page: number, limit: number, totalPage: number }
   }> {

       const { category, isActive, limit = 10, page = 1, search, sortBy, sortOrder, minPrice, maxPrice } = queryDto;

       const where: Prisma.ProductWhereInput = {};

       if (category) {
           where.categoryId = category;
       }

       if (isActive != undefined) {
           where.isActive = isActive;
       }

       if (search) {
           where.OR = [
               { name: { contains: search, mode: 'insensitive' } },
               { description: { contains: search, mode: 'insensitive' } }
           ];
       }

       const total = await this.prisma.product.count({ where });

       const products = await this.prisma.product.findMany({
           where,
           skip: (page - 1) * limit,
           take: limit,
           orderBy: { createdAt: 'desc' },
           include: {
               category: true,
           },
       });

       return {
           data: products.map((product) => this.formateProduct(product)),
           meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
       };
   }


   //get product by id
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
       return this.formateProduct(product);
   }

   private formateProduct(product: Product & { category: Category }): ProductResponseDto {
       return {
           ...product,
           price: Number(product.price),
           category: product.category.name,
           categoryName: product.category.name,
       };
   }
}
