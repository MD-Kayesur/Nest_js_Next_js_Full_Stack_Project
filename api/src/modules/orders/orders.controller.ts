import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ModerateThrottler } from 'src/common/decorators/custom-throttler.decorators';
import { orderApiResponseDto } from './dto/order-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { NotFoundError } from 'rxjs';
 

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
    @ApiCreatedResponse({type:orderApiResponseDto
 ,description: 'Order created successfully',})
 @ApiBadRequestResponse({type:orderApiResponseDto
 ,description: 'invalid data or insufficient stock',})
 @ApiNotFoundResponse({type:orderApiResponseDto
 ,description: 'cart  not found or impty',})
 @ApiTooManyRequestsResponse({type:orderApiResponseDto
 ,description: 'Too many requests-  rate limit exceeded',})
   async  create( createOrderDto: CreateOrderDto , @GetUser("id") userId:string) {
        
const {items,shippingAddress=createOrderDto.shippingAddress
}=createOrderDto;

for (const item of items) {
    const product=await this.prisma.product.findUnique({where:{id:item.productId}});
    if (!product) { 
        throw new NotFoundException("product not found")
    }
    if (product.stock < item.quantity) {
        throw new NotFoundException("Insufficient stock")
  
    };
    
}

    



 

   }}
