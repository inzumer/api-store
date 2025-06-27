/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

/** Commons */
import { WishlistExample } from '../common/examples/wishlist.example';
import {
  UserWishlistEmptyExample,
  UserWishlistExample,
} from '../common/examples/user.example';

/** Nest */
import { Controller, Put, Get, Param, Body, Req } from '@nestjs/common';

/** Whislist dependencies */
import { WishlistService } from './wishlist.service';

/** Express */
import { Request } from 'express';

/** Decorators */
import { CommonHeaders } from '../common/decorators';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Put('/add/:userId')
  @ApiOperation({ summary: 'Add a product to the wishlist' })
  @CommonHeaders()
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ schema: WishlistExample })
  @ApiResponse({
    status: 200,
    description: 'Product added to wishlist successfully',
    schema: {
      example: UserWishlistExample,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or another relationated with a product',
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
    description: 'Internal server error during user lookup by email',
    schema: {
      example: {
        statusCode: 500,
        message:
          'An unexpected error occurred while adding a product to the wishlist.',
        error: 'Internal Server Error',
      },
    },
  })
  async addProductToWishlist(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(req, userId, productId);
  }

  @Put('/delete/:userId')
  @ApiOperation({ summary: 'Remove a product from the wishlist' })
  @CommonHeaders()
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ schema: WishlistExample })
  @ApiResponse({
    status: 200,
    description: 'Product removed from wishlist successfully',
    schema: {
      example: UserWishlistEmptyExample,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID "683670955dbc65f5c48871a2" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while removing product from wishlist',
    schema: {
      example: {
        statusCode: 500,
        message:
          'An unexpected error occurred while removing a product from the wishlist.',
        error: 'Internal Server Error',
      },
    },
  })
  async removeProductFromWishlist(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(req, userId, productId);
  }

  @Get('/get-all/:userId')
  @ApiOperation({ summary: "Get all products in the user's wishlist" })
  @CommonHeaders()
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist retrieved successfully',
    schema: {
      example: UserWishlistExample,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID "683670955dbc65f5c48871a2" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while retrieving wishlist',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while retrieving the wishlist.',
        error: 'Internal Server Error',
      },
    },
  })
  async getWishlist(@Req() req: Request, @Param('userId') userId: string) {
    return this.wishlistService.getWishlist(req, userId);
  }
}
