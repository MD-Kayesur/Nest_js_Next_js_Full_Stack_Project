import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }
    
}
