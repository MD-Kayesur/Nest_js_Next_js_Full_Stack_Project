//product response dto

import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto {
    @ApiProperty({
        description: 'Product id',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Product Name',
    })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Product Description',
    })
    description: string;

    @ApiProperty({
        description: 'Product price',
        example: 100,
    })
    price: number;

    @ApiProperty({
        description: 'Product stock',
        example: 10,
    })
    stock: number;

    @ApiProperty({
        description: 'Product sku',
        example: 'SKU-123',
    })
    sku: string;

    @ApiProperty({
        description: 'Product image url',
        example: 'https://example.com/image.jpg',
    })
    imageUrl: string;

    @ApiProperty({
        description: 'Product category id',
        example: '1',
    })
    categoryId: string;
}