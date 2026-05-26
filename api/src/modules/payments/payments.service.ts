import { BadRequestException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment } from '@prisma/client';
import { paymentresponseDto } from './dto/payment-response.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Injectable()
export class PaymentsService {
    private readonly stripe: Stripe;

    constructor( private prisma:PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: process.env.STRIPE_API_VERSION,
        });
    }




    //create payment intent
    createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto, userId: string):Promise<{success:boolean,data:{clientSecret:string,paymentId:string},message?:string}> {
      try {
        const {orderId,amount,currency,description}=createPaymentIntentDto


        const order=await this.prisma.order.findFirst({
          where:{
            id:orderId,
            userId:userId
          }
        })

        if(!order){
          throw new NotFoundException(`order with ID ${orderId} not found`);
        }
      }  


      const existingPayment=await this.prisma.payment.findFirst({
        where:{
          orderId
        }
      })

if(existingPayment && existingPayment.status=== PaymentStaus.COMPLETED){
  throw new BadRequestException(`Order Already payment done with payment id ${existingPayment.id}`);
}



const paymentIntent=await this.stripe.paymentIntents.create({
  amount:Math.round(amount*100),
  currencyk
 
  metadata:{
    orderId:orderId
  }
})


const payment=await this.prisma.payment.create({
  data:{
    orderId,
    userId,
    amount,
    currency,
    description,
     status:PaymentStaus.PENDING,
    paymentMethod:'STRIPE'
    transactionId:paymentIntent.id,
    
  }
})

return {
  success:true,
  data:{
    clientSecret:paymentIntent.client_secret,
    paymentId:payment.id
  },
  message:'Payment intent created successfully',
}


    }

 

//get all payment for current user
async findAll(userId: string) : Promise<{success:true,data:paymentresponseDto[],message?:string}>{
   const payments=await this.prisma.payment.findMany({
    where:{
      userId
    },
    orderBy:{
      createdAt:'desc'
    }
   })

   return {
    success:true,
    data:payments.map(payment=>this.mapTopaymentresponseDto(payment)),
    message:'Payments retrievied successfully',
   }



@Get(":id")
@ApiParam({
    name:"id",
    required:true,
    description:"Payment id",
    example:"1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d"
})
@ApiOperation({
  summary: "get payment by id",
  description: "get payment by id",
})

@ApiOkResponse({
  status: 200,
  type: paymentresponseDto,
  description: 'Payment retrieved successfully',
})

async findOne(@Param("id") id:string,@GetUser('id') userId:string){
    const payment=await this.prisma.payment.findFirst({
        where:{
            id,
            userId
        }
    })
    if(!payment){
        throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return {
        success:true,
        data:this.mapTopaymentresponseDto(payment),
        message:'Payment retrievied successfully'
    }
}

   
}






private mapTopaymentresponseDto(payment:{
    id:string,
        orderId:string,
        userId:string,
        amount: Prisma.Decimal,
        currency:string,
        description:string,
        status:PaymentStaus,
        paymentMethod: string|null,
        transactionId:string|null,
        createdAt:Date,
        updatedAt:Date
}):paymentresponseDto{
     return{
      id:payment.id,
      orderId:payment.orderId,
      userId:payment.userId,
      amount:payment.amount.toNumber(),
      currency:payment.currency,
      description:payment.description,
      status:payment.status,
      paymentMethod:payment.paymentMethod,
      transactionId:payment.transactionId,
      createdAt:payment.createdAt,
      updatedAt:payment.updatedAt
     }
}






}
