import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { orderApiResponseDto } from '../orders/dto/order-response.dto';
import { CreatePaymentIntentApiDto, PaymentApiResponseDto } from './dto/payment-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { get } from 'http';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

@Post('create-intent')
@ApiOperation({ summary: 'Create payment (STRIPE)', description: 'create payment intent', })
@ApiCreatedResponse({ 
    status: 200, 
    type: CreatePaymentIntentApiDto, 
    description: 'payment intent created successfully', })
async createPayment() {
    return await this.paymentsService.createPayment();
}

@ApiBadRequestResponse({
    description:'invalid data or order not found'
    
})
async createPaymentIntent( @Body() createPaymentIntentApiDto: CreatePaymentIntentDto,@GetUser('id') userId:string){
    return await this.paymentsService.createPaymentIntent(createPaymentIntentApiDto,userId);
}





@Post('confirm')
@ApiOperation({ summary: 'Confirm payment (STRIPE)', description: 'confirm payment', })
@ApiCreatedResponse({ 
    status: 200, 
    type: CreatePaymentIntentApiDto, 
    description: 'payment confirmed successfully', })

    @ApiBadRequestResponse({
        description:'Payment not found or already completd or payment faild'
        
    })

async confirmPayment(@Body() confirmPaymentApiDto: ConfirmPaymentDto,@GetUser('id') userId:string) {
    return await this.paymentsService.confirmPayment(confirmPaymentApiDto,userId);
}

//confirm payment intent
async confirmPaymentIntent(@GetUser('id') userId:string,@Body() confirmPaymentApiDto: ConfirmPaymentDto):Promise<{success:boolean,data:PaymentResponseDto,message?:string}>{
    
    const {paymentIntentId,orderId,status,message}=confirmPaymentApiDto;


    const payment = await this.prisma.payment.findFirst({
        where:{
            orderId,
            userId
        }
    })
    if(!payment){
        throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }
    
    if(payment.status === PaymentStaus.COMPLETED){
        throw new BadRequestException(`Payment with ID ${paymentId} is already completed`);
    }



    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);


    if(paymentIntent.status !=='succeeded'){
        throw new BadRequestException(`Payment with ID ${paymentId} is not succeeded`);
    }


const [updatedPayment,updatedOrder]=await Promise.all([
    this.prisma.payment.update({
        where:{
            id:payment.id
        },
        data:{
            status:PaymentStaus.COMPLETED,
            transactionId:paymentIntent.id,
            paymentMethod:'STRIPE'
        }
    }),
    this.prisma.order.update({
        where:{
            id:orderId
        },
        data:{
            status:'PROCESSING'
        }
    })
])



const order=await this.prisma.order.findFirst({
    where:{
        id:orderId
    }
})

if(!order?.cardId){
   await this.prisma.cart.update({
    where:{
        userId:userId
    },
    data:{
        checkedOut:true
         
        
    }
   })
}

return {
    success:true,
    data:this.mapTopaymentresponseDto(updatedPayment),
    message:'Payment confirmed successfully',
    
}

}


@Get()
@ApiOperation({ summary: 'get all paypments', description: 'get all paypments', })
@ApiOkResponse({ 
    status: 200, 
    type: PaymentApiResponseDto, 
    description: 'get all paypments successfully', })

    @ApiBadRequestResponse({
        description:'get all paypments faild'
        
    })

async findAll(@GetUser('id') userId:string) {
    return await this.paymentsService.findAll(userId);
}




//get payment by order id

@Get('order/:orderId')
@ApiParam({
    name: 'orderId',
    required: true,
    description: 'Order id',
    example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d'
})
@ApiOperation({ summary: 'get payment by order id', description: 'get payment by order id', })
@ApiOkResponse({ 
    status: 200, 
    type: PaymentApiResponseDto, 
    description: 'get payment by order id successfully', })

@ApiNotFoundResponse({
    status: 404,
    description: 'Payment not found',
})

    @ApiBadRequestResponse({
        description:'get payment by order id faild'
        
    })

async findByOrder(@Param('orderId') orderId:string,@GetUser('id') userId:string) {
    return await this.paymentsService.findByOrder(orderId,userId);
}



}
