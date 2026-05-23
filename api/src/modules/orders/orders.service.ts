import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';

@Injectable()
export class OrdersService {

    constructor(private prisma: PrismaService) { }

//create order 
createOrder(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
        data: createOrderDto,
    });
}

//get all orders
    getAllOrders() {
        return this.prisma.order.findMany();
    }





}
