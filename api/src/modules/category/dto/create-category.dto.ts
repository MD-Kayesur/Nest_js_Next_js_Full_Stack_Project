//create category dto

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, isNotEmpty, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'Electronics',
        description: 'Category name',
        maxLength: 100,
        minLength: 3,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    name: string;

    
    @ApiProperty({
        example: 'Electronics',
        description: 'Category description',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    @MinLength(10)
    description?: string;




    @ApiProperty({
        example: 'electronics',
        description: 'Category slug',
        maxLength: 100,
        minLength: 3,
        required:false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    
 slug?:string




    @IsOptional()
    @ApiProperty({
        example: 'Electronics',
        description: 'Category image',
        required:false,
    })
    @IsString()
    @IsOptional()

    image?: string;



    @ApiProperty({
        example: true,
        description: 'Category status',
        required:false,
        default:true
    })  
    @IsBoolean()
@IsOptional()
isActive:boolean
 
    
}