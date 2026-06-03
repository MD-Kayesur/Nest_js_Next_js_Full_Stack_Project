//update. exting product dto 
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "./create-products.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({
        description: 'Product name',
        example: 'woreless Headphone',
        required: false,
    })
    name: string;
    @ApiProperty({
        description: 'Product description',
        example: 'High qualty woreless Headphone',
        required: false,
    })
    description: string;

    @ApiProperty({
        description: 'Product price in usd',
        example: 99.99,
        type: Number,
        required: false,
    })
    price: number;
    @ApiProperty({
        description: 'Product stock',
        example: 100,
        type: Number,
        required: false,
    })
    stock: number;
    @ApiProperty({
        description: ' Stock keeping unit of product',
        example: 'WH-01',
        required: false,
    })
    sku: string;
    @ApiProperty({
        description: 'Product image url',
        example: 'https://example.com/image.jpg',
        required: false,
    })
    imageUrl: string;
    @ApiProperty({
        description: 'Product category id',
        example: '1',
        required: false,
    })
    categoryId: string;
    @ApiProperty({
        description: 'Product category is active',
        example: true,
        required: false,
    })
    isActive: boolean;
}