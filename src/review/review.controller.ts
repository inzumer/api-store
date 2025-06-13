/** Nest */
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';

/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

/** Commons */
import { ApiCommonError } from '../common/decorators/swagger.decorators';
import {
  ProductExample,
  ReviewExample,
} from '../common/examples/product.example';

/** Product dependencies */
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/add/:id')
  @ApiOperation({ summary: 'Add a review to a product by user ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({
    type: ReviewDto,
    required: true,
    description: 'Review data',
    examples: {
      validReview: {
        summary: 'Valid review',
        description: 'A typical review from user',
        value: {
          userId: '60c72b2f9b1e8d001c8e4f3a',
          review: ReviewExample,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Review added successfully',
    schema: {
      example: ProductExample,
    },
  })
  @ApiCommonError('Add review')
  async addReview(
    @Param('id') productId: string,
    @Body() review: ReviewDto,
    userId: string,
  ) {
    return await this.reviewService.addReview(productId, userId, review);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: "Remove a user's review from a product" })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({
    type: String,
    required: true,
    description: 'User ID data',
    examples: {
      validReview: {
        summary: 'Valid user ID',
        description: 'A user ID',
        value: { userId: '60c72b2f9b1e8d001c8e4f3a' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Review removed successfully',
    schema: {
      example: ProductExample,
    },
  })
  @ApiCommonError('Delete review')
  async removeReview(@Param('id') productId: string, @Body() userId: string) {
    return await this.reviewService.removeReview(productId, userId);
  }

  @Get('/get-all/:id')
  @ApiOperation({ summary: 'Get all user details from reviews of a product' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID to get reviews for',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users who left a review for the product',
    schema: {
      example: [ReviewExample],
    },
  })
  @ApiCommonError('All reviews')
  async getProductReviewUsers(@Param('id') productId: string) {
    return await this.reviewService.getReviews(productId);
  }
}
