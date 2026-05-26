import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment } from '@prisma/client';
import { paymentresponseDto } from './dto/payment-response.dto';

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
async findAll(userId: string) {
  return await this.prisma.payment.findMany({
    where:{
      userId
    }
  })
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
