 //create new order dto
 
 import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
 
 export class CreateOrderDto {
    @ApiProperty({
        description: 'User id',
        example: 'd6be59d6-180b-4c09-b1f0-791886e9059d',
        required: true,
    })
    @IsString()
    
    userId: string;


    @ApiProperty({
        description: 'Product id',
        example: 'd6be59d6-180b-4c09-b1f0-791886e9059d',
        required: true,
    })
    @IsString()
    productId: string;

    @ApiProperty({
        description: 'Product quantity',
        example: 1,
        required: true,
    })
    @IsNumber()
    quantity: number;

    @ApiProperty({
        description: 'Product price',
        example: 1,
        required: true,
    })
    @IsNumber()
    price: number;
    @ApiProperty({
        description: 'Product total price',
        example: 1,
        required: true,
    })
    total: number;
    @ApiProperty({
        description: 'Order status',
        example: 'pending',
        required: true,
    })
    status: string;
    @ApiProperty({
        description: 'Payment method',
        example: 'COD',
        required: true,
    })
    paymentMethod: string;
    @ApiProperty({
        description: 'Shipping address',
        example: 'Dhaka',
        required: true,
    })
    shippingAddress: string;
    @ApiProperty({
        description: 'Shipping city',
        example: 'Dhaka',
        required: true,
    })
    shippingCity: string;
    @ApiProperty({
        description: 'Shipping country',
        example: 'Bangladesh',
        required: true,
    })
    shippingCountry: string;
    @ApiProperty({
        description: 'Shipping zip code',
        example: '1200',
        required: true,
    })
    shippingZipCode: string;
    @ApiProperty({
        description: 'Shipping phone',
        example: '1234567890',
        required: true,
    })
    shippingPhone: string;
    @ApiProperty({
        description: 'Order date',
        example: '2022-01-01',
        required: true,
    })
    orderDate: Date;
    @ApiProperty({
        description: 'Order total',
        example: 1,
        required: true,
    })
    orderTotal: number;
    @ApiProperty({
        description: 'Order status',
        example: 'pending',
        required: true,
    })
    orderStatus: string;
}