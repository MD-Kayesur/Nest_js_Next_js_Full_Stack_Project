import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiTooManyRequestsResponse, getSchemaPath } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ModerateThrottler, RelaxedThrottler } from 'src/common/decorators/custom-throttler.decorators';
import { orderApiResponseDto, OrderResponseDto, PaginatedResponseDto } from './dto/order-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    //create order
    @Post()
    @ModerateThrottler()
    @ApiOperation({summary:'create order',description:'create order',})
    @ApiBody({type:CreateOrderDto})
    @ApiCreatedResponse({type:orderApiResponseDto,description: 'Order created successfully',})
    @ApiBadRequestResponse({type:orderApiResponseDto,description: 'invalid data or insufficient stock',})
    @ApiNotFoundResponse({type:orderApiResponseDto,description: 'cart not found or empty',})
    @ApiTooManyRequestsResponse({type:orderApiResponseDto,description: 'Too many requests- rate limit exceeded',})
    async create(@Body() createOrderDto: CreateOrderDto, @GetUser("id") userId: string) {
        return this.ordersService.createOrder(userId, createOrderDto);
    }





//get all orders for admin and 

@Get('admin/all-orders')
@Roles(Role.ADMIN)
@RelaxedThrottler()
@ApiOperation({summary:'[ADMIN] get all orders (Paginated) ' ,description:'get all orders',})
@ApiQuery({
    name:'page',
    type:Number,
    description:'page number',
    required:false,
    default:1
})
@ApiQuery({
    name:'limit',
    type:Number,
    description:'limit per page',
    required:false,
    default:10
})
@ApiQuery({
    name:'search',
    type:String,
    description:'search by user email,phone or name',
    required:false,
})
@ApiQuery({
    name:'status',
    type:String,
    description:'search by order status',
    required:false,
})
@ApiQuery({
    name:'startDate',
    type:Date,
    description:'search by order date',
    required:false,
})
@ApiQuery({
    name:'endDate',
    type:Date,
    description:'search by order date',
    required:false,
})

@ApiResponse({status:200,type:orderApiResponseDto,description: 'data fetch successfully',
    schema:{
        type:'object',
        properties:{
            data:{
                type:'array',
                items:{$ref:getSchemaPath('OrderResponseDto')}
            },

            total:{
                type:'number',
               
            },
            page:{
                type:'number',
               
            },
            limit:{
                type:'number',
               
            },
              
        }
    }
})

@ApiForbiddenResponse({ description: ' admin access required',})
async findAllForAdmin(
    @Query() QueryOrderDto
){
    return await this.ordersService.findAllForAdmin(query)
}

 
//user Get own Orders

@Get('my-orders')
@RelaxedThrottler()
@ApiOperation({summary:'[User] get my orders' ,description:'get my orders',})
@ApiQuery({
    name:'page',
    type:Number,
    description:'page number',
    required:false,
    default:1
})
@ApiQuery({
    name:'limit',
    type:Number,
    description:'limit per page',
    required:false,
    default:10
})
@ApiQuery({
    name:'search',
    type:String,
    description:'search by user email,phone or name',
    required:false,
})
@ApiQuery({
    name:'status',
    type:String,
    description:'search by order status',
    required:false,
})
@ApiQuery({
    name:'startDate',
    type:Date,
    description:'search by order date',
    required:false,
})
@ApiQuery({
    name:'endDate',
    type:Date,
    description:'search by order date',
    required:false,
})

@ApiResponse({status:200,type:orderApiResponseDto,description: 'data fetch successfully',
    schema:{
        type:'object',
        properties:{
            data:{
                type:'array',
                items:{$ref:getSchemaPath('OrderResponseDto')}
            },

            total:{
                type:'number',
               
            },
            page:{
                type:'number',
               
            },
            limit:{
                type:'number',
               
            },
              
        }
    }
})

async findMyOrders(
    @Query() QueryOrderDto
){
    return await this.ordersService.findMyOrders(query)
}





//user Get own orders

@Get()
@RelaxedThrottler()
@ApiOperation({
    summary:'Get all orders for current user (paginated) ' ,
    description:'get my orders',
})
@ApiQuery({
    name:'page',
    type:Number,
    description:'page number',
    required:false,
    default:1
})
@ApiQuery({
    name:'limit',
    type:Number,
    description:'limit per page',
    required:false,
    default:10
})
@ApiQuery({
    name:'search',
    type:String,
    description:'search by user email,phone or name',
    required:false,
})
@ApiQuery({
    name:'status',
    type:String,
    description:'search by order status',
    required:false,
})
@ApiQuery({
    name:'startDate',
    type:Date,
    description:'search by order date',
    required:false,
})
@ApiQuery({
    name:'endDate',
    type:Date,
    description:'search by order date',
    required:false,
})

@ApiOkResponse({
     description:'list of user orders   .',
     type:PaginatedResponseDto
})


async findAll(
    @Query() query:QueryOrderDto ,@GetUser("id") userId: string
){
    return await this.ordersService.findAll(userId,query)
}


//Admin: Get order by id 

@Get('admin/:id')
@Roles(Role.ADMIN)
@RelaxedThrottler()
@ApiOperation({summary:'[ADMIN] Get order by id ' ,description:'get order by id',})
@ApiParam({
    name:'id',
    type:String,
    description:'order ID',
    required:true,
})
@ApiOkResponse({type:orderApiResponseDto,description: 'order details fetch successfully',})

@ApiNotFoundResponse({type:orderApiResponseDto,description: 'Order not found',})
@ApiForbiddenResponse({ description: ' admin access required',})
@ApiBadRequestResponse({type:orderApiResponseDto,description: 'invalid data',})
@ApiTooManyRequestsResponse({type:orderApiResponseDto,description: 'Too many requests- rate limit exceeded',})
async findOneAdmin(
    @Param('id') id:string ,
    // @GetUser("id") userId: string
){
    return await this.ordersService.findOne(id)
}







//user : Get user own order by id 

@Get(':id')
@RelaxedThrottler()
@ApiOperation({
    summary:'Get user own order by id ' ,
    description:'get my order by id',
})
@ApiParam({
    name:'id',
    type:String,
    description:'order ID',
    required:true,
})
@ApiOkResponse({
     description:'order details   .',
     type:orderApiResponseDto<OrderResponseDto>
})
@ApiNotFoundResponse({type:orderApiResponseDto,description: 'Order not found',})
@ApiForbiddenResponse({ description: ' admin access required',})
@ApiBadRequestResponse({type:orderApiResponseDto,description: 'invalid data',})
@ApiTooManyRequestsResponse({type:orderApiResponseDto,description: 'Too many requests- rate limit exceeded',})
async findOne(
    @Param('id') id:string ,@GetUser("id") userId: string
){
    return await this.ordersService.findOne(id,userId)
}







//ADMIN update order

@Patch(':id')
@Roles(Role.ADMIN)
@RelaxedThrottler()
@ApiOperation({
    summary:'[ADMIN] Update order status ' ,
    description:'update order status',
})
@ApiParam({
    name:'id',
    type:String,
    description:'order ID',
    required:true,
})
@ApiOkResponse({
     description:'order details   .',
     type:orderApiResponseDto<OrderResponseDto>
})
@ApiNotFoundResponse({type:orderApiResponseDto,description: 'Order not found',})
@ApiForbiddenResponse({ description: ' admin access required',})
@ApiBadRequestResponse({type:orderApiResponseDto,description: 'invalid data',})
@ApiTooManyRequestsResponse({type:orderApiResponseDto,description: 'Too many requests- rate limit exceeded',})
async update(
    @Param('id') id:string ,@Body() updateOrderDto: UpdateOrderDto,
){
    return await this.ordersService.update(id,updateOrderDto)
}








}
 
