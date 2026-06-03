import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional } from "class-validator"

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
 @Type(()=>Number)
 page?:number=1



 
 @ApiProperty({
    description: 'Limit per page',
    example: 10,
 })
 @IsOptional()
 @Type(()=>Number)
 limit?:number=10


 @ApiProperty({
    description: 'Order status',
    example: 'pending',
 })
 @IsOptional()
 @Type(()=>String)
 
 status?:string


@ApiProperty({
    description: 'Search query',
    example: '1',
})
@IsOptional()
@Type(()=>String)
search?:string




 @ApiProperty({
    description: 'User ID',
    example: '1',
 })
 userId?:string
 
   




 
}