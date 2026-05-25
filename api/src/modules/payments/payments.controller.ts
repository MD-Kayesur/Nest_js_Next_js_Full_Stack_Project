import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { orderApiResponseDto } from '../orders/dto/order-response.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

@Post()
@ApiOperation({ summary: 'Create payment (SSLCOMMERZ)', description: 'create payment', })
@ApiCreatedResponse({ status: 200, type: CreatePaymentIntentApiDto, description: 'payment created successfully', })
async createPayment() {
    return await this.paymentsService.createPayment();
}





}
