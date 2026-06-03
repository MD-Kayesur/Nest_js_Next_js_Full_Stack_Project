 //create new order dto
 
 import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
 
 export class OrderItemDto {



     @ApiProperty({
        description: 'Product id',
        example: 'd6be59d6-180b-4c09-b1f0-791886e9059d',
        required: true,
    })
    @IsNotEmpty()
     @IsString()
    productId: string;



    @ApiProperty({
        description: 'Product quantity',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

 @ApiProperty({
        description: 'Product price',
        example: 99.99,
        required: true,
    })
    @IsNumber({maxDecimalPlaces:2},{
        message:'price must be a number with max 2 decimal places'
    })
@Type(()=>Number)
    price: number;

 
 
}


export class CreateOrderDto {
    @ApiProperty({
         type:[OrderItemDto]
    })
     @IsArray()
    @ValidateNested({each:true})
   @Type(()=>OrderItemDto)
    items: OrderItemDto[];
    




    @ApiProperty({
        description: 'Shipping address',
        example: 'Dhaka',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    shippingAddress: string;



    // @ApiProperty({
    //     description: 'Shipping city',
    //     example: 'Dhaka',
    //     required: false,
    // })
    // @IsString()
    // @IsOptional()
    // @IsNotEmpty()
    // shippingCity: string;



    // @ApiProperty({
    //     description: 'Shipping country',
    //     example: 'Bangladesh',
    //     required: true,
    // })
    // @IsString()
    // @IsNotEmpty()
    // shippingCountry: string;



    // @ApiProperty({
    //     description: 'Shipping zip code',
    //     example: '1200',
    //     required: true,
    // })
    // @IsString()
    // @IsNotEmpty()
    // shippingZipCode: string;



    // @ApiProperty({
    //     description: 'Shipping phone',
    //     example: '1234567890',
    //     required: true,
    // })
    // @IsString()
    // @IsNotEmpty()
    // shippingPhone: string;



    // @ApiProperty({
    //     description: 'Order date',
    //     example: '2022-01-01',
    //     required: true,
    // })
    // @IsString()
    // @IsNotEmpty()
    // orderDate: Date;



    // @ApiProperty({
    //     description: 'Order total',
    //     example: 1,
    //     required: true,
    // })
    // @IsNumber()
    // @IsNotEmpty()
    // orderTotal: number;



    // @ApiProperty({
    //     description: 'Order status',
    //     example: 'pending',
    //     required: true,
    // })
    // @IsString()
    // @IsNotEmpty()
    // orderStatus: string;
}


