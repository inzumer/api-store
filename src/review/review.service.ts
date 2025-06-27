/** Nest */
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';

/** Services */
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

/** Schema */
import { Product } from '../product/schema';

/** DTO */
import { ReviewDto } from './dto/review.dto';

/** Express */
import { Request } from 'express';

/** Logger */
import { LoggerService } from '../common/logger';

@Injectable()
export class ReviewService {
  logger = new LoggerService('ReviewService');

  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Calculates the average rating of a product based on its reviews.
   *
   * @param req - The request object, used for logging.
   * @param productId - The ID of the product whose rating is to be recalculated.
   * @returns The updated product with the recalculated average rating.
   */
  async calculateAverageRating(
    req: Request,
    productId: string,
  ): Promise<Product> {
    try {
      const product = await this.productService.getProductById(productId);

      const ratings = product.reviews.map((review) => review.rating);

      const total = ratings.reduce((acc, curr) => acc + curr, 0);

      const updateRange = this.productService.updateProduct(productId, {
        score: total,
      });

      return updateRange;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to calculate average product rating',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while calculating average rating.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Adds a new review to the specified product.
   *
   * @param req - The request object, used for logging.
   * @param productId - The ID of the product to review.
   * @param userId - The ID of the user submitting the review.
   * @param review - The review data including rating, comment, and user info.
   * @returns The updated product with the new review added.
   * @throws NotFoundException if a review by this user already exists for the product.
   */
  async addReview(
    req: Request,
    productId: string,
    userId: string,
    review: ReviewDto,
  ): Promise<Product> {
    try {
      const product = await this.productService.getProductById(productId);

      const existingReview = product.reviews.find(
        (review) => review.user.toString() === userId.toString(),
      );

      if (existingReview) {
        throw new ConflictException(
          `User "${userId}" has already reviewed this product.`,
        );
      }

      const productUpdate = this.productService.updateProduct(productId, {
        reviews: [
          ...product.reviews,
          {
            ...review,
            user: userId,
          },
        ],
      });

      await this.calculateAverageRating(req, productId);

      return productUpdate;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to add product review',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while adding the review.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Removes a review from the specified product by user ID.
   *
   * @param req - The request object, used for logging.
   * @param productId - The ID of the product to remove the review from.
   * @param userId - The ID of the user whose review is to be removed.
   * @returns The updated product with the review removed.
   * @throws NotFoundException if no review from the specified user exists.
   */
  async removeReview(
    req: Request,
    productId: string,
    userId: string,
  ): Promise<Product> {
    try {
      const product = await this.productService.getProductById(productId);

      const filteredReviews = product.reviews.filter(
        (review) => review.user.toString() !== userId.toString(),
      );

      if (!filteredReviews) {
        throw new NotFoundException(
          `No review found from user "${userId}" for this product`,
        );
      }

      const productUpdate = this.productService.updateProduct(productId, {
        reviews: { ...filteredReviews },
      });

      await this.calculateAverageRating(req, productId);

      return productUpdate;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to remove review from product',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while removing the review.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves all reviews of product.
   *
   * @param req - The request object, used for logging.
   * @param id - The ID of the product.
   * @returns A list of all existing reviews.
   */
  async getReviews(req: Request, productId: string) {
    try {
      const product = await this.productService.getProductById(productId);

      const userIds = product.reviews.map((review) => review.user);

      const reviewsUsers = await Promise.all(
        userIds.map(async (userId) => {
          const user = await this.userService.findById(req, userId);
          return {
            id: userId.toString(),
            first_name: user.first_name,
            last_name: user.last_name,
            nickname: user.nickname,
            profile_photo: user.profile_photo,
          };
        }),
      );

      return reviewsUsers;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to retrieve product reviews',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while retrieving reviews.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
