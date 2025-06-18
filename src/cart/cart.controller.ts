/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

/** Commons */
import { CartExample } from '../common/examples/cart.example';
import {
  UserCartExample,
  UserCartEmptyExample,
} from '../common/examples/user.example';

/** Nest */
import { Controller, Put, Get, Param, Body } from '@nestjs/common';

/** Cart dependencies */
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put('/add/:userId')
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ required: true, schema: CartExample })
  @ApiResponse({
    status: 200,
    description: 'Product added to cart successfully',
    schema: {
      example: UserCartExample,
    },
  })
  async addProductToCart(
    @Param('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Put('/delete/:userId')
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @ApiParam({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'abc123' },
      },
      required: ['productId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product removed from cart successfully',
    schema: {
      example: UserCartEmptyExample,
    },
  })
  async removeProductFromCart(
    @Param('userId') userId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Get('/get-all/:userId')
  @ApiOperation({ summary: "Get all products in the user's cart" })
  @ApiParam({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    example: UserCartExample,
  })
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Put('/update/:userId')
  @ApiOperation({ summary: 'Update the quantity of a product in the cart' })
  @ApiParam({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiBody({
    schema: CartExample,
  })
  @ApiResponse({
    status: 200,
    description: 'Cart product updated successfully',
    schema: {
      example: UserCartExample,
    },
  })
  async updateCart(
    @Param('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateCartProduct(userId, productId, quantity);
  }
}
