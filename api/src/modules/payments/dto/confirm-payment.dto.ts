//confirm payment dto

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmPaymentDto {

    @ApiProperty({
        description: 'Payment id',
        example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d',
     })
   
    @IsNotEmpty()
    @IsString()
    paymentIntentId:string


@ApiProperty({
    description: 'Order id',
    example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d',
})
@IsNotEmpty()
@IsString()
orderId:string


    @ApiProperty({
        description: 'Payment status',
        example: 'COMPLETED',
        enum:['COMPLETED','FAILED','PENDING','CANCELLED','FAILED']
     })
     @IsNotEmpty()
     @IsString()
    status:string

    @ApiProperty({
        description: 'Payment message',
        example: 'Payment confirmed successfully',
    })
    @IsString()
    @IsNotEmpty()
    message:string
}