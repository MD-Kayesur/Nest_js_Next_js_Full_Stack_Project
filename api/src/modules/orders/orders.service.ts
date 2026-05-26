import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { orderApiResponseDto, OrderResponseDto } from './dto/order-response.dto';
import { Order, OrderItem, OrderStatus, Product, User } from '@prisma/client';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    // create order 
    async create(userId: string, createOrderDto: CreateOrderDto): Promise<orderApiResponseDto<OrderResponseDto>> {
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

        return this.warp(order);
    }

    // get all orders for admin and user
    async findAllForAdmin(query: QueryOrderDto): Promise<{
        data: OrderResponseDto[],
        total: number,
        page: number,
        limit: number,
        success?: boolean
    }> {
        const { page = 1, limit = 10, search, status } = query;
        const skip = (page - 1) * limit;
        const where: any = {};

        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { orderNumber: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.order.count({ where })
        ]);

        return {
            data: orders.map((order) => this.map(order)),
            total,
            page,
            limit,
            success: true
        };
    }

    // get user current orders
    async findAll(userId: string, query: QueryOrderDto): Promise<{
        data: OrderResponseDto[],
        total: number,
        page: number,
        limit: number,
        success?: boolean
    }> {
        const { page = 1, limit = 10, search, status } = query;
        const skip = (page - 1) * limit;
        const where: any = {
            userId
        };

        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { orderNumber: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.order.count({ where })
        ]);

        return {
            data: orders.map((order) => this.map(order)),
            total,
            page,
            limit,
            success: true
        };
    }

    // find order by Id 
    async findOne(id: string, userId?: string): Promise<orderApiResponseDto<OrderResponseDto>> {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }
        const order = await this.prisma.order.findFirst({
            where,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true
            }
        });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return this.warp(order);
    }

    // update order status by admin
    async update(id: string, updateOrderDto: UpdateOrderDto, userId?: string): Promise<orderApiResponseDto<OrderResponseDto>> {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }
        const order = await this.prisma.order.findFirst({
            where
        });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        
        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                status: updateOrderDto.status ? (updateOrderDto.status as OrderStatus) : undefined,
                trakingNumber: updateOrderDto.trakingNumber,
                notes: updateOrderDto.notes,
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

        return this.warp(updated);
    }

    // delete order by admin
    async delete(id: string, userId?: string): Promise<orderApiResponseDto<OrderResponseDto>> {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }
        const order = await this.prisma.order.findFirst({
            where
        });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        const deleted = await this.prisma.order.delete({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true
            }
        });

        return this.warp(deleted);
    }

    // cancel order by admin/user
    async cancel(id: string, userId?: string): Promise<orderApiResponseDto<OrderResponseDto>> {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }
        const order = await this.prisma.order.findFirst({
            where,
            include: {
                orderItems: true,
                user: true
            }
        });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException(`only pending order can be cancelled`);
        }

        const cancelled = await this.prisma.$transaction(async (tx) => {
            for (const item of order.orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        }
                    }
                });
            }

            return tx.order.update({
                where: { id },
                data: {
                    status: OrderStatus.CANCELLED,
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
        });

        return this.warp(cancelled);
    }

    private warp(order: any): orderApiResponseDto<OrderResponseDto> {
        return {
            success: true,
            message: 'Order status updated successfully',
            data: this.map(order)
        };
    }

    private map(order: any): OrderResponseDto {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            shippingAddress: order.shippingAddress ?? "",
            shippingCity: "",
            shippingCountry: "",
            shippingZipCode: "",
            shippingPhone: "",
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            trakingNumber: order.trakingNumber ?? undefined,
            notes: order.notes ?? undefined,
            items: order.orderItems.map((item) => {
                return {
                    id: item.id,
                    productId: item.productId,
                    productName: item.product.name,
                    productImage: item.product.imageUrl ?? "",
                    quantity: item.quantity,
                    price: Number(item.price),
                    subtotal: Number(item.price) * item.quantity,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                };
            }),
            ...(order.user && {
                userEmail: order.user.email,
                userName: `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim(),
                userPhone: order.user.phoneNumber ?? undefined,
                userAddress: order.user.address ?? undefined
            })
        };
    }
}