/** Schema */
import { Product } from '../product/schema';

import { Injectable, NotFoundException } from '@nestjs/common';

/** DTO */
import { ReviewDto } from './dto/review.dto';

/** Services */
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Calculates the average rating of a product based on its reviews.
   *
   * @param productId - The ID of the product whose rating is to be recalculated.
   * @returns The updated product with the recalculated average rating.
   */
  async calculateAverageRating(productId: string): Promise<Product> {
    const product = await this.productService.getProductById(productId);

    const ratings = product.reviews.map((review) => review.rating);

    const total = ratings.reduce((acc, curr) => acc + curr, 0);

    const updateRange = this.productService.updateProduct(productId, {
      score: total,
    });

    return updateRange;
  }

  /**
   * Adds a new review to the specified product.
   *
   * @param productId - The ID of the product to review.
   * @param userId - The ID of the user submitting the review.
   * @param review - The review data including rating, comment, and user info.
   * @returns The updated product with the new review added.
   * @throws NotFoundException if a review by this user already exists for the product.
   */
  async addReview(
    productId: string,
    userId: string,
    review: ReviewDto,
  ): Promise<Product> {
    const product = await this.productService.getProductById(productId);

    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId.toString(),
    );

    if (existingReview) {
      throw new NotFoundException(
        `Already exists review from this user "${userId}"`,
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

    await this.calculateAverageRating(productId);

    return productUpdate;
  }

  /**
   * Removes a review from the specified product by user ID.
   *
   * @param productId - The ID of the product to remove the review from.
   * @param userId - The ID of the user whose review is to be removed.
   * @returns The updated product with the review removed.
   * @throws NotFoundException if no review from the specified user exists.
   */
  async removeReview(productId: string, userId: string): Promise<Product> {
    const product = await this.productService.getProductById(productId);

    const filteredReviews = product.reviews.filter(
      (review) => review.user.toString() !== userId.toString(),
    );

    if (!filteredReviews) {
      throw new NotFoundException(
        `Don't exists review from this user "${userId}"`,
      );
    }

    const productUpdate = this.productService.updateProduct(productId, {
      reviews: { ...filteredReviews },
    });

    await this.calculateAverageRating(productId);

    return productUpdate;
  }

  /**
   * Retrieves all reviews of product.
   *
   * @param id - The ID of the product.
   * @returns A list of all existing reviews.
   */
  async getReviews(productId: string) {
    const product = await this.productService.getProductById(productId);

    const userIds = product.reviews.map((review) => review.user);

    const reviewsUsers = await Promise.all(
      userIds.map(async (userId) => {
        const user = await this.userService.findById(userId);
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
  }
}
