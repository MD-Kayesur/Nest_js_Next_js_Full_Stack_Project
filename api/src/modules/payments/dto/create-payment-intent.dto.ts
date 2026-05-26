//create payment intent dto

import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentIntentDto {
    @ApiProperty({
        description: 'Order id',
        example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d',
     })
   
    @IsNotEmpty()
    @IsString()
    orderId:string


    @ApiProperty({
        description: 'Order amount',
        example: '100',
     })
     @IsNotEmpty()
     @IsNumber()
    amount:number

    @ApiProperty({
        description: 'Order currency',
        example: 'BDT',
     })
     @Optional()
     @IsString()
    currency:string

 
    
@ApiProperty({
    description: 'Order description',
    example: 'Order description',
})
@Optional()
@IsString()
description:string


}