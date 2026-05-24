//update order dto
 import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
 
 export class UpdateOrderDto {
    @ApiProperty({
        description: 'Order status',
        enum:["PENDING","COMPLETED","CANCELLED"],
        example: 'pending',
    })
    @IsOptional()
    @IsString()
    @IsEnum(OrderStatus,{message:'Invalid status value'})
    status: string;



    @ApiProperty({
        description: 'Tracking number',
        example: '1234567890',
    })
    @IsOptional()
    @IsString()
    trakingNumber: string;



    @ApiProperty({
        description: 'Notes',
        example: 'Notes',
    })
    @IsOptional()
    @IsString()
notes:string;










 }