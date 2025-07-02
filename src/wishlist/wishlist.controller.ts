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
import { CommonHeadersWithToken } from '../common/decorators';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Put('/add/:userId')
  @ApiOperation({ summary: 'Add a product to the wishlist' })
  @CommonHeadersWithToken()
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ schema: WishlistExample })
  @ApiResponse({
    status: 200,
    description: 'Product added to wishlist successfully',
    schema: {
      example: UserWishlistExample,
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
  @CommonHeadersWithToken()
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ schema: WishlistExample })
  @ApiResponse({
    status: 200,
    description: 'Product removed from wishlist successfully',
    schema: {
      example: UserWishlistEmptyExample,
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
  @CommonHeadersWithToken()
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist retrieved successfully',
    schema: {
      example: UserWishlistExample,
    },
  })
  async getWishlist(@Req() req: Request, @Param('userId') userId: string) {
    return this.wishlistService.getWishlist(req, userId);
  }
}
