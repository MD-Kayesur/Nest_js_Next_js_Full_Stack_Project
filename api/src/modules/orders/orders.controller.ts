import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ModerateThrottler } from 'src/common/decorators/custom-throttler.decorators';
 

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard,RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    //create order
   
   
    @Post()
    @ModerateThrottler()
    @ApiOperation({summary:'create order',description:'create order',})
    @ApiBody({type:CreateOrderDto})
    
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(createOrderDto);
    }

    //get all orders
    @Get()
    getAllOrders() {
        return this.ordersService.getAllOrders();
    }

}
