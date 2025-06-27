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

/** Express */
import { Request } from 'express';

/** Nest */
import { Controller, Put, Get, Param, Body, Req } from '@nestjs/common';

/** Cart dependencies */
import { CartService } from './cart.service';

/** Decorators */
import { CommonHeaders } from '../common/decorators';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put('/add/:userId')
  @ApiOperation({ summary: 'Add a product to the cart' })
  @CommonHeaders()
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ required: true, schema: CartExample })
  @ApiResponse({
    status: 200,
    description: 'Product added to cart successfully',
    schema: {
      example: UserCartExample,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid quantity or bad request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Product not found',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product or User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error while updating cart',
    schema: {
      example: {
        statusCode: 500,
        message:
          'An unexpected error occurred while adding the product to cart.',
        error: 'Internal Server Error',
      },
    },
  })
  async addProductToCart(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addToCart(req, userId, productId, quantity);
  }

  @Put('/delete/:userId')
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @CommonHeaders()
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
  @ApiResponse({
    status: 400,
    description: 'Invalid Mongo IDs or bad request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid ID format',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 123 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error during cart update',
    schema: {
      example: {
        statusCode: 500,
        message:
          'An unexpected error occurred while removing the product from cart.',
        error: 'Internal Server Error',
      },
    },
  })
  async removeProductFromCart(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(req, userId, productId);
  }

  @Get('/get-all/:userId')
  @ApiOperation({ summary: "Get all products in the user's cart" })
  @CommonHeaders()
  @ApiParam({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    example: UserCartExample,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID format or bad request',
    schema: {
      example: {
        statusCode: 400,
        message: 'User with ID 683670955dbc65f5c48871a2 not found',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 123 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error while retrieving cart',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while retrieving the cart.',
        error: 'Internal Server Error',
      },
    },
  })
  async getCart(@Req() req: Request, @Param('userId') userId: string) {
    return this.cartService.getCart(req, userId);
  }

  @Put('/update/:userId')
  @ApiOperation({ summary: 'Update the quantity of a product in the cart' })
  @CommonHeaders()
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
  @ApiResponse({
    status: 400,
    description: 'Bad Request (invalid ID or quantity)',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid quantity "-2". It must be greater than 0.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 649e5d42f62a9c23b8c6e9b7 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error during cart update',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  async updateCart(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateCartProduct(req, userId, productId, quantity);
  }
}
