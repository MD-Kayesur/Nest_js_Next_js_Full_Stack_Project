import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('carts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get('my-cart')
  @ApiOperation({ summary: 'Get active cart for logged in user' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async getMyCart(@GetUser('id') userId: string) {
    const cart = await this.cartsService.getMyCart(userId);
    return { success: true, data: cart };
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product item to cart' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantity: { type: 'number', default: 1 },
      },
      required: ['productId', 'quantity'],
    },
  })
  @ApiResponse({ status: 200, description: 'Product added to cart successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async addToCart(
    @GetUser('id') userId: string,
    @Body() body: { productId: string; quantity: number }
  ) {
    const cart = await this.cartsService.addToCart(userId, body.productId, body.quantity);
    return { success: true, data: cart };
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number' },
      },
      required: ['quantity'],
    },
  })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async updateCartItem(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: { quantity: number }
  ) {
    const cart = await this.cartsService.updateCartItem(userId, id, body.quantity);
    return { success: true, data: cart };
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async removeFromCart(@GetUser('id') userId: string, @Param('id') id: string) {
    const cart = await this.cartsService.removeFromCart(userId, id);
    return { success: true, data: cart };
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all items from active cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async clearCart(@GetUser('id') userId: string) {
    const cart = await this.cartsService.clearCart(userId);
    return { success: true, data: cart };
  }
}
