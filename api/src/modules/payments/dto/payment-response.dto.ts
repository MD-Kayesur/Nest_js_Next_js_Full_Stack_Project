import { ApiProperty } from "@nestjs/swagger";

export class paymentresponseDto {
  @ApiProperty({
    description: 'Payment id',
    example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d',
  })
  id: string;

  @ApiProperty({
    description: 'order id',
    example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d',
  })
  orderId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: '100',
  })
  amount: number;

  @ApiProperty({
    description: 'User id',
    example: '1233ea2d-2a5f-4f3a-9b7a-8d2c4b6e7f0d',
  })
  userId: string;

  @ApiProperty({
    description: 'Payment currency (USD or BDT)',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Payment status (success,failed,pending)',
    example: 'COMPLETED',
    enum: ['COMPLETED', 'FAILED', 'PENDING', 'CANCELLED']
  })
  status: string;

  @ApiProperty({
    description: 'STRIPE',
    nullable: true,
  })
  paymentMethod: string | null;

  @ApiProperty({
    description: 'Payment description',
    example: 'Order payment',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Transaction id',
    nullable: true,
    example: 'ID_343453',
  })
  transactionId: string | null;

  @ApiProperty({
    description: 'Payment create date',
    example: '2022-01-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Payment update date',
    example: '2022-01-01',
  })
  updatedAt: Date;
}

export class CreatePaymentIntentApiDto {
  @ApiProperty({
    description: 'Stripe client secret for payment',
    example: 'pi_12345678901234567890123456789012',
  })
  clientSecret: string;

  @ApiProperty({
    description: 'Stripe payment id in database',
    example: '12345678901234567890123456789012',
  })
  paymentId: string;
}

export class PaymentApiResponseDto {
  @ApiProperty({
    description: 'Payment intent session',
    example: 'succeeded',
  })
  success: boolean;

  @ApiProperty({
    type: paymentresponseDto
  })
  data: paymentresponseDto;

  @ApiProperty({
    description: 'Payment message',
    example: 'Payment intent created successfully',
    required: false
  })
  message?: string;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({
    description: 'Payment intent session',
    example: 'succeeded',
  })
  success: boolean;

  @ApiProperty({
    type: CreatePaymentIntentApiDto
  })
  data: CreatePaymentIntentApiDto;

  @ApiProperty({
    description: 'Payment message',
    example: 'Payment intent created successfully',
    required: false
  })
  message?: string;
}