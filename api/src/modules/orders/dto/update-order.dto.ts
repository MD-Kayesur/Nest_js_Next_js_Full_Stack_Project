//update order dto
 import { ApiProperty } from "@nestjs/swagger";
 
 export class UpdateOrderDto {
    @ApiProperty({
        description: 'Order status',
        example: 'pending',
    })
    status: string;
 }