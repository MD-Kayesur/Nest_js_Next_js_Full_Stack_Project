
// create product dto 

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, max, MaxLength, maxLength, Min } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'Product name',
        example: 'Product Name',
        maxLength: 100,
        minLength: 1,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name: string;



    @ApiProperty({
        description: 'Product description',
        example: 'Product Description',
        required:false,
        maxLength: 200,
        minLength: 1,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product price in usd',
        example: 99.99,
        maxLength: 10,
        minLength: 1,
    })
    @IsNumber({
        maxDecimalPlaces:2
    })
    @IsNotEmpty()
    @Min(1)
    @Type(()=>Number)
    price: number;

    @ApiProperty({
        description: 'Product stock',
        example: 10,
    })
    @IsNumber()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Product sku',
        example: 'SKU-123',
    })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiProperty({
        description: 'Product image url',
        example: 'https://example.com/image.jpg',
    })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({
        description: 'Product category id',
        example: '1',
    })
    @IsString()
    @IsNotEmpty()
    categoryId: string;
}