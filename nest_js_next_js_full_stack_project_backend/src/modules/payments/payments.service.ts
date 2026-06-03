import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import { paymentresponseDto } from './dto/payment-response.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Injectable()
export class PaymentsService {
    private readonly stripe: any;

    constructor(private prisma: PrismaService) {
        const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_development';
        const options: any = {};
        if (process.env.STRIPE_API_VERSION) {
            options.apiVersion = process.env.STRIPE_API_VERSION;
        }
        this.stripe = new Stripe(stripeKey, options);
    }

    // stub method for controller compatibility
    async createPayment() {
        return { success: true, message: 'Create payment stub' };
    }

    // create payment intent
    async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto, userId: string): Promise<{ success: boolean, data: { clientSecret: string, paymentId: string }, message?: string }> {
        try {
            const { orderId, amount, currency, description } = createPaymentIntentDto;

            const order = await this.prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: userId
                }
            });

            if (!order) {
                throw new NotFoundException(`order with ID ${orderId} not found`);
            }

            const existingPayment = await this.prisma.payment.findFirst({
                where: {
                    orderId
                }
            });

            if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
                throw new BadRequestException(`Order Already payment done with payment id ${existingPayment.id}`);
            }

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: currency,
                metadata: {
                    orderId: orderId
                }
            });

            const payment = await this.prisma.payment.create({
                data: {
                    orderId,
                    userId,
                    amount: new Prisma.Decimal(amount),
                    currency,
                    description: description || null,
                    status: PaymentStatus.PENDING,
                    paymentMethod: 'STRIPE',
                    transactionId: paymentIntent.id,
                }
            });

            return {
                success: true,
                data: {
                    clientSecret: paymentIntent.client_secret || '',
                    paymentId: payment.id
                },
                message: 'Payment intent created successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    // confirm payment
    async confirmPayment(confirmPaymentDto: ConfirmPaymentDto, userId: string): Promise<{ success: boolean, data: paymentresponseDto, message?: string }> {
        const { paymentIntentId, orderId } = confirmPaymentDto;

        const payment = await this.prisma.payment.findFirst({
            where: {
                orderId,
                userId
            }
        });
        if (!payment) {
            throw new NotFoundException(`Payment for order ID ${orderId} not found`);
        }

        if (payment.status === PaymentStatus.COMPLETED) {
            throw new BadRequestException(`Payment for order ID ${orderId} is already completed`);
        }

        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            throw new BadRequestException(`Payment intent is not succeeded. Status: ${paymentIntent.status}`);
        }

        const [updatedPayment] = await this.prisma.$transaction(async (tx) => {
            const p = await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: PaymentStatus.COMPLETED,
                    transactionId: paymentIntent.id,
                    paymentMethod: 'STRIPE'
                }
            });

            await tx.order.update({
                where: { id: orderId },
                data: { status: 'PROCESSING' as any }
            });

            const order = await tx.order.findUnique({
                where: { id: orderId }
            });

            if (order && order.cartId) {
                await tx.cart.update({
                    where: { id: order.cartId },
                    data: { checkedOut: true }
                });
            } else {
                const activeCart = await tx.cart.findFirst({
                    where: { userId, checkedOut: false }
                });
                if (activeCart) {
                    await tx.cart.update({
                        where: { id: activeCart.id },
                        data: { checkedOut: true }
                    });
                }
            }

            return [p];
        });

        return {
            success: true,
            data: this.mapTopaymentresponseDto(updatedPayment),
            message: 'Payment confirmed successfully',
        };
    }

    // get all payment for current user
    async findAll(userId: string): Promise<{ success: true, data: paymentresponseDto[], message?: string }> {
        const payments = await this.prisma.payment.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            success: true,
            data: payments.map(payment => this.mapTopaymentresponseDto(payment)),
            message: 'Payments retrievied successfully',
        };
    }

    // Get payment by id 
    async findOne(id: string, userId: string): Promise<{ success: true, data: paymentresponseDto, message?: string }> {
        const payment = await this.prisma.payment.findFirst({
            where: {
                id,
                userId
            }
        });
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        return {
            success: true,
            data: this.mapTopaymentresponseDto(payment),
            message: 'Payment retrievied successfully'
        };
    }

    // get payment by order id
    async findByOrder(orderId: string, userId: string): Promise<{ success: true, data: paymentresponseDto, message?: string }> {
        const payment = await this.prisma.payment.findFirst({
            where: {
                orderId,
                userId
            }
        });
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${orderId} not found`);
        }
        return {
            success: true,
            data: this.mapTopaymentresponseDto(payment),
            message: 'Payment retrievied successfully'
        };
    }

    private mapTopaymentresponseDto(payment: {
        id: string,
        orderId: string,
        userId: string,
        amount: Prisma.Decimal,
        currency: string,
        description: string | null,
        status: PaymentStatus,
        paymentMethod: string | null,
        transactionId: string | null,
        createdAt: Date,
        updatedAt: Date
    }): paymentresponseDto {
        return {
            id: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: payment.amount.toNumber(),
            currency: payment.currency,
            description: payment.description || '',
            status: payment.status,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        };
    }
}
