import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';
 import { orderApiResponseDto } from './dto/order-response.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {

    constructor(private prisma: PrismaService) { }

//create order 
createOrder(userId:string,createOrderDto: CreateOrderDto): Promise<orderApiResponseDto<orderApiResponseDto>> {
    return this.prisma.order.create({
        data: createOrderDto,
    });
}

//get all orders
    getAllOrders() {
        return this.prisma.order.findMany();
    }

//create order by user
createByUser(userId:string,createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
        data: createOrderDto,
    });
}



}
