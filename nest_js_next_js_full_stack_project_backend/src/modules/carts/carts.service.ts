import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  // Get active cart for a user (or create one if it doesn't exist)
  async getMyCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId, checkedOut: false },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    return this.formatCart(cart);
  }

  // Add an item to the cart
  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getMyCart(userId);

    // Verify product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(`Product with ID "${productId}" not found or inactive`);
    }

    // Check if the item already exists in the cart
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingCartItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getMyCart(userId);
  }

  // Update quantity of a cart item
  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId || cartItem.cart.checkedOut) {
      throw new NotFoundException(`Cart item with ID "${cartItemId}" not found`);
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return this.getMyCart(userId);
  }

  // Remove an item from the cart
  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId || cartItem.cart.checkedOut) {
      throw new NotFoundException(`Cart item with ID "${cartItemId}" not found`);
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.getMyCart(userId);
  }

  // Clear all items from the active cart
  async clearCart(userId: string) {
    const cart = await this.getMyCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getMyCart(userId);
  }

  // Format cart and cast Decimal fields to numbers
  private formatCart(cart: any) {
    return {
      id: cart.id,
      userId: cart.userId,
      checkedOut: cart.checkedOut,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      cartItems: cart.cartItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        cartId: item.cartId,
        productId: item.productId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: Number(item.product.price),
          stock: item.product.stock,
          sku: item.product.sku,
          imageUrl: item.product.imageUrl,
          isActive: item.product.isActive,
          categoryId: item.product.categoryId,
          categoryName: item.product.category?.name || 'Uncategorized',
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
        },
      })),
    };
  }
}
