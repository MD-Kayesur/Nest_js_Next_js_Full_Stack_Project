import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { orderApiResponseDto } from './dto/order-response.dto';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {

    constructor(private prisma: PrismaService) { }

    //create order 
    async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<orderApiResponseDto<any>> {
        const { items, shippingAddress = createOrderDto.shippingAddress } = createOrderDto;

        for (const item of items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) { 
                throw new NotFoundException(`product with id ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product ${product.name}. Available stock: ${product.stock} . Requested quantity: ${item.quantity}`);
            }
        }

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const latestCart = await this.prisma.cart.findFirst({
            where: { userId, checkedOut: false },
            orderBy: { createdAt: 'desc' }
        });

        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    status: OrderStatus.PENDING,
                    shippingAddress,
                    totalAmount: total,
                    cartId: latestCart?.id || null,
                    orderItems: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        })),
                    },
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true
                }
            });

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            return newOrder;
        });

        return {
            success: true,
            message: 'Order created successfully',
            data: order
        };
    }

    //get all orders
    getAllOrders() {
        return this.prisma.order.findMany();
    }

    //create order by user
    createByUser(userId: string, createOrderDto: CreateOrderDto) {
        return this.createOrder(userId, createOrderDto);
    }
}

