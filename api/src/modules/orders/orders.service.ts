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

    //create order 
    async create(userId: string, createOrderDto: CreateOrderDto): Promise<orderApiResponseDto<any>> {
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

        return  this.warp(order)
    }

    



 //get all orders for admin and user
    async findAllForAdmin(query:QueryOrderDto):Promise<{
        data:OrderResponseDto[],
        total:number,
        page:number,
        limit:number
    }>{
        const {page,limit,search,status,startDate,endDate} = query
        const skip = (page - 1) * limit
        const where:any={}

        if(status){
            where.status = status
        }
        if(search){
            where.OR=[{id:{contains:search,mode:'insensitive'}},
                {orderNumber:{contains:search,mode:'insensitive'}}]
        }
        

        const [order,total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take:limit,
                include:{
                    orderItems:{
                        include:{
                            product:true,
                        },
                    },
                    user:{
                        select:{
                            id:true,
                            email:true,
                            firstName:true,
                            lastName:true,
                             
                        }
                    }
                },
           orderBy:{
            createdAt:'desc'
           }
            }),
            this.prisma.order.count({where})
        ])
return {
    data:orders.map((order)=>this.map(order)),
    total,
    page,
    limit,
    success:true
}
        
    }





//get user current orders

async fingAll(userId: string, query: QueryOrderDto): Promise <{
    data:OrderResponseDto[],
        total:number,
        page:number,
        limit:number
}>{
    const { page, limit, search, status } = query
    const skip = (page - 1) * limit
    const where: any = {
        userId
    }


    if (status) {
        where.status = status
    }
    if (search) {
        where.OR = [{ id: { contains: search, mode: 'insensitive' } },
        { orderNumber: { contains: search, mode: 'insensitive' } }]
    }

    const [order, total] = await Promise.all([
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
                user:  true
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        this.prisma.order.count({ where })
    ])
    return {
        data: orders.map((order) => this.map(order)),
        total,
        page,
        limit,
        success: true
    }
}



//find order by Id 
async findOne(id:string,userId:string) :Promise<orderApiResponseDto<OrderResponseDto>>{
    const where :any = {id}
    if(userId){
        where.userId = userId
    }
    const order = await this.prisma.order.findFirst({
        where,
        include:{
            orderItems:{
                include:{
                    product:true,
                },
            },
            user:true
        }
    })
    if(!order){
        throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return this.warp(order)
}



///update order status by admin

async update(id:string,updateOrderDto:UpdateOrderDto):Promise<orderApiResponseDto<OrderResponseDto>>{
    const where:any={id}
    if(userId)where.userId = userId
    const 
    const order = await this.prisma.order.findUnique({
        where,
        include:{
            orderItems:{
                include:{
                    product:true,
                },
            },
            user:true
        }
    })
    if(!order){
        throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return this.warp(await this.prisma.order.update({
        where:{id},
        data:{
            status:updateOrderDto.status,
            trakingNumber:updateOrderDto.trakingNumber,
            notes:updateOrderDto.notes,
        }
    }))
}


//delete order by admin
async delete(id:string,userId:string):Promise<orderApiResponseDto<OrderResponseDto>>{
    const where:any={id}
    if(userId)where.userId = userId
    const 
    const order = await this.prisma.order.findUnique({
        where,
        include:{
            orderItems:{
                include:{
                    product:true,
                },
            },
            user:true
        }
    })
    if(!order){
        throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return this.warp(await this.prisma.order.delete({
        where:{id},
        include:{
            orderItems:{
                include:{
                    product:true,
                },
            },
            user:true
        }
    }))
} 



                   

//cancel order by admin 
async cancel(id:string,userId:string):Promise<orderApiResponseDto<OrderResponseDto>>{
    const where:any={id}
    if(userId)where.userId = userId
    const 
    const order = await this.prisma.order.findFirst({
        where,
        include:{
            orderItems: true,
            user:true
        }
    })
    if(!order){
        throw new NotFoundException(`Order with ID ${id} not found`)
    }
    if(order.status === OrderStatus.CANCELLED){
        throw new BadRequestException(`only pending order can be cancelled `)
    }
    const cancelled= await this.prisma.$transaction(async(tx)=>{
//back to stock

        for(const item of order.orderItems){
            await tx.product.update({
                where:{id:item.productId},
                data:{
                    stock:{
                        increment:item.quantity,
                    }
                }
            })
        }
//update order status
        return tx.order.update({
            where:{id},
            data:{
                status:OrderStatus.CANCELLED,
            },
            include:{
                orderItems:{
                    include:{
                        product:true,
                    },
                },
               user:true
            }
        })
    })



    return this.warp(cancelled)
}









    private warp(order:Order & {orderItems:(OrderItem & {product:Product})[]} , user?:User):orderApiResponseDto<OrderResponseDto>{
        return {
            success: true,
            message: 'Order created successfully',
            data: this.map(order)
        };
    }

    private map(order:Order & {orderItems:(OrderItem & {product:Product})[]} , user?:User):OrderResponseDto{
        return{
            id: order.id,
            userId: order.userId,
            status: order.status,
            items: order.orderItems,
            total: order.totalAmount,
            shippingAddress: order.shippingAddress ?? "",
            items: order.orderItems.map((item) => {
                return {
                    id: item.id,
                    productId: item.productId,
                    productName: item.product.name,
                    productImage: item.product.image,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal:Number(item.price)*Number(item.quantity),
                    createdAt:item.createdAt,
                    updatedAt:item.updatedAt
                }
            }),
            ...(order.user&&{
                userEmail:order.user.email,
                userName: `${order.user.firstName} ${order.user.lastName}`.trim(),
                userPhone:order.user.phone,
                userAddress:order.user.address
            })
            // shippingCity: order.shippingCity,
            // shippingCountry: order.shippingCountry,
            // shippingZipCode: order.shippingZipCode,
            // shippingPhone: order.shippingPhone,
            // createdAt: order.createdAt,
            // updatedAt: order.updatedAt
        }
    }






 


}










 