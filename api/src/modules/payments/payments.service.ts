import { Injectable } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private readonly stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: process.env.STRIPE_API_VERSION,
        });
    }

    createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto, userId: string) {
        return "Success";
    }
}
