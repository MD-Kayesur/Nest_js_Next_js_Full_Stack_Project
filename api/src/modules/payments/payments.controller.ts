import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { orderApiResponseDto } from '../orders/dto/order-response.dto';
import { CreatePaymentIntentApiDto, PaymentApiResponseDto, paymentresponseDto } from './dto/payment-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    @ApiOperation({ summary: 'Create payment (STRIPE)', description: 'create payment intent', })
    @ApiCreatedResponse({ 
        type: CreatePaymentIntentApiDto, 
        description: 'payment intent created successfully', })
    @ApiBadRequestResponse({
        description: 'invalid data or order not found'
    })
    async createPaymentIntent(@Body() createPaymentIntentApiDto: CreatePaymentIntentDto, @GetUser('id') userId: string) {
        return await this.paymentsService.createPaymentIntent(createPaymentIntentApiDto, userId);
    }

    @Post('create')
    @ApiOperation({ summary: 'Create payment stub', description: 'create payment stub', })
    @ApiCreatedResponse({ 
        type: CreatePaymentIntentApiDto, 
        description: 'payment intent created successfully', })
    async createPayment() {
        return await this.paymentsService.createPayment();
    }

    @Post('confirm')
    @ApiOperation({ summary: 'Confirm payment (STRIPE)', description: 'confirm payment', })
    @ApiCreatedResponse({ 
        type: CreatePaymentIntentApiDto, 
        description: 'payment confirmed successfully', })
    @ApiBadRequestResponse({
        description: 'Payment not found or already completed or payment failed'
    })
    async confirmPayment(@Body() confirmPaymentApiDto: ConfirmPaymentDto, @GetUser('id') userId: string) {
        return await this.paymentsService.confirmPayment(confirmPaymentApiDto, userId);
    }

    // confirm payment intent delegate
    async confirmPaymentIntent(@GetUser('id') userId: string, @Body() confirmPaymentApiDto: ConfirmPaymentDto): Promise<{ success: boolean, data: paymentresponseDto, message?: string }> {
        return await this.paymentsService.confirmPayment(confirmPaymentApiDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'get all payments', description: 'get all payments', })
    @ApiOkResponse({ 
        type: PaymentApiResponseDto, 
        description: 'get all payments successfully', })
    @ApiBadRequestResponse({
        description: 'get all payments failed'
    })
    async findAll(@GetUser('id') userId: string) {
        return await this.paymentsService.findAll(userId);
    }

    @Get('order/:orderId')
    @ApiParam({
        name: 'orderId',
        required: true,
        description: 'Order id',
        example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d'
    })
    @ApiOperation({ summary: 'get payment by order id', description: 'get payment by order id', })
    @ApiOkResponse({ 
        type: PaymentApiResponseDto, 
        description: 'get payment by order id successfully', })
    @ApiNotFoundResponse({
        description: 'Payment not found',
    })
    @ApiBadRequestResponse({
        description: 'get payment by order id failed'
    })
    async findByOrder(@Param('orderId') orderId: string, @GetUser('id') userId: string) {
        return await this.paymentsService.findByOrder(orderId, userId);
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Payment id',
        example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d'
    })
    @ApiOperation({ summary: 'get payment by id', description: 'get payment by id', })
    @ApiOkResponse({ 
        type: PaymentApiResponseDto, 
        description: 'Payment retrieved successfully', })
    @ApiNotFoundResponse({
        description: 'Payment not found',
    })
    async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
        return await this.paymentsService.findOne(id, userId);
    }
}
