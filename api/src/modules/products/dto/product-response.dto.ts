//product response dto

import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto {
    @ApiProperty({
        description: 'Product id',
        example: '46081339-6998-43ed-b6b9-50f58f643162',
    })
    id: string;

    @ApiProperty({
        description: 'Product name',
        example: 'woreless Headphone',
    })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'High qualty woreless Headphone',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        description: 'Product price in usd',
        example: 99.99,
        type: Number,
    })
    price: number;

    @ApiProperty({
        description: 'Product stock',
        example: 100,
    })
    stock: number;

    @ApiProperty({
        description: ' Stock keeping unit of product',
        example: 'WH-01',
     
    })
    sku: string | null;

    @ApiProperty({
        description: 'Product image url',
        example: 'https://example.com/image.jpg',
         
    })
    imageUrl: string | null;



    
@ApiProperty({
    description: 'Product category ',
    example: 'Electronics',
})
category:string | null;





    @ApiProperty({
        description: 'Product category id',
        example: '1',
    })
    categoryId: string;

    @ApiProperty({
        description: 'Product category is active',
        example: true,
    })
isActive:boolean;



@ApiProperty({
    description: 'Product created at',
    example: '2022-01-01T00:00:00.000Z',
})
createdAt:Date;

@ApiProperty({
    description: 'Product updated at',
    example: '2022-01-01T00:00:00.000Z',
})
updatedAt:Date;



    @ApiProperty({
        description: 'Product category name',
        example: 'Electronics',
    })
    categoryName: string;
 
}