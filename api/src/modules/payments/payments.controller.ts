import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { orderApiResponseDto } from '../orders/dto/order-response.dto';
import { CreatePaymentIntentApiDto } from './dto/payment-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

@Post()
@ApiOperation({ summary: 'Create payment (SSLCOMMERZ)', description: 'create payment', })
@ApiCreatedResponse({ 
    status: 200, 
    type: CreatePaymentIntentApiDto, 
    description: 'payment created successfully', })
async createPayment() {
    return await this.paymentsService.createPayment();
}

@ApiBadRequestResponse({
    description:'invalid data or order not found'
    
})
async createPaymentIntent( @Body() createPaymentIntentApiDto: CreatePaymentIntentDto,@GetUser('id') userId:string){
    return await this.paymentsService.createPaymentIntent(createPaymentIntentApiDto,userId);
}


}
