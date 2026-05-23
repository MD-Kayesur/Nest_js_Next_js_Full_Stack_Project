//order response dto
 import { ApiProperty } from "@nestjs/swagger";
 
export class orderApiResponseDto <T>{



@ApiProperty({
    description: 'indicates if the resquest was success',
    example: true,
})
success: boolean;
    

@ApiProperty({
    description: 'returned data',
    type:Object,
    example: true,
})
data:T

@ApiProperty({
    description: 'message of the resquest',
     nullable:true,
     required:true,
     
})
message:string




    // @ApiProperty({
    //     description: 'Order ID',
    //     example: '1',
    // })
    // id: string;

    // @ApiProperty({
    //     description: 'User ID',
    //     example: '1',
    // })
    // userId: string;

    // @ApiProperty({
    //     description: 'Order items',
    //     example: [
    //     {
    //         "id": "1",
    //         "userId": "1",
    //         "productId": "1",
    //         "quantity": 1,
    //         "price": 10,
    //         "createdAt": "2022-01-01",
    //         "updatedAt": "2022-01-01"
    //     }
    // ],
    // })
    // items: any[];

    // @ApiProperty({
    //     description: 'Order total',
    //     example: 1,
    // })
    // totalAmount: number;

    // @ApiProperty({
    //     description: 'Order status',
    //     example: 'pending',
    // })
    // status: string;
    
    // @ApiProperty({
    //     description: 'Shipping address',
    //     example: 'Dhaka',
    // })
    // shippingAddress: string;

    // @ApiProperty({
    //     description: 'Shipping city',
    //     example: 'Dhaka',
    // })
    // shippingCity: string;

    // @ApiProperty({
    //     description: 'Shipping country',
    //     example: 'Bangladesh',
    // })
    // shippingCountry: string;

    // @ApiProperty({
    //     description: 'Shipping zip code',
    //     example: '1200',
    // })
    // shippingZipCode: string;

    // @ApiProperty({
    //     description: 'Shipping phone',
    //     example: '1234567890',
    // })
    // shippingPhone: string;

    // @ApiProperty({
    //     description: 'Created at',
    //     example: '2022-01-01',
    // })
    // createdAt: Date;

    // @ApiProperty({
    //     description: 'Updated at',
    //     example: '2022-01-01',
    // })
    // updatedAt: Date;
}

export class  OrderResponseDto {

    @ApiProperty({
        description: 'Order ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: 'User ID',
        example: '1',
    })
    userId: string;

   @ApiProperty({
        description: 'Order status',
        example: 'pending',
    })
    status: string;




    @ApiProperty({
        description: 'Order items',
        example: [
        {
            "id": "1",
            "userId": "1",
            "productId": "1",
            "quantity": 1,
            "price": 10,
            "createdAt": "2022-01-01",
            "updatedAt": "2022-01-01"
        }
    ],
    })
    items: any[];

    @ApiProperty({
        description: 'Order total',
        example: 1,
    })
    totalAmount: number;

 
    
    @ApiProperty({
        description: 'Shipping address',
        example: 'Dhaka',
    })
    shippingAddress: string;

    @ApiProperty({
        description: 'Shipping city',
        example: 'Dhaka',
    })
    shippingCity: string;

    @ApiProperty({
        description: 'Shipping country',
        example: 'Bangladesh',
    })
    shippingCountry: string;

    @ApiProperty({
        description: 'Shipping zip code',
        example: '1200',
    })
    shippingZipCode: string;

    @ApiProperty({
        description: 'Shipping phone',
        example: '1234567890',
    })
    shippingPhone: string;

    @ApiProperty({
        description: 'Created at',
        example: '2022-01-01',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Updated at',
        example: '2022-01-01',
    })
    updatedAt: Date;
}