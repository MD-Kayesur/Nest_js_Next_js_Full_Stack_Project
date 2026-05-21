// query product dto 

import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class QueryProductDto {


@ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    required:false,
})
@IsString()
@IsOptional()
 
category?:string;



@ApiProperty({
    description: 'Product active status',
    example: true,
 })

 @Transform((value)=>{
    if(value==='true' || value===true){
        return true;
    }
    if(value==='false' || value===false){
        return false;
    }
    return undefined;
 })
 @IsBoolean()
@IsOptional()
isActive?:boolean;



 @ApiProperty({
        description: 'Search by product name or category name or sku or product code',
        example: 'headphone',
        required:false,
    })
    @IsString()
    @IsOptional()
    search?: string;


    @ApiProperty({
        description: 'Page number items',
        example: 1,
        required:false,
        default:1,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number=1;
 


    @ApiProperty({
        description: 'Limit per page',
        example: 10,
        required:false,
        default:10,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number=10;

   
}