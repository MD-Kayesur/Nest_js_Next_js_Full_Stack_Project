import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export class QueryOrderDto {
 @ApiProperty({
    description: 'Page number',
    example: 1,
 })
 @IsOptional()
 @IsNumber()
 @Type(()=>Number)
 page?:number=1



 
 @ApiProperty({
    description: 'Limit per page',
    example: 10,
 })
 @IsOptional()
 @IsNumber()
 @Type(()=>Number)
 limit?:number=10


 @ApiProperty({
    description: 'Order status',
    example: 'pending',
 })
 @IsOptional()
 @IsString()
 @Type(()=>String)
 status?:string


@ApiProperty({
    description: 'Search query',
    example: '1',
})
@IsOptional()
@IsString()
@Type(()=>String)
search?:string




 @ApiProperty({
    description: 'User ID',
    example: '1',
 })
 @IsOptional()
 @IsString()
 @Type(()=>String)
 userId?:string
 
   




 
}