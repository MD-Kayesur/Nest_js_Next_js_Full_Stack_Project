
// create product dto 

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, max, MaxLength, maxLength, Min, MinLength } from "class-validator";

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
        description: 'Stpck keeping unit of Product sku',
        example: 'SKU-123',
        maxLength: 100,
        minLength: 1,
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(1)
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
        required:true,
    })
    @IsString()
    @IsNotEmpty()
    categoryId: string;


    @ApiProperty({
        description: 'Product status',
        example: true,
        default: true,
        required:false,
    })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;



}