/** Nest */
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/** Mongoose */
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

/** Schema */
import { User, UserDocument } from '../user/schema';
import { Product, ProductDocument } from '../product/schema';

/** Services */
import { UserService } from '../user/user.service';

/** Express */
import { Request } from 'express';

/** Logger */
import { LoggerService } from '../common/logger';

@Injectable()
export class WishlistService extends UserService {
  logger = new LoggerService('WishlistService');

  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    super(userModel);
  }

  /**
   * Retrieves the list of products in a user's wishlist.
   * @param req - The request object, used for logging.
   * @param userId - The user's ID.
   * @returns An array of products in the wishlist.
   */
  async getWishlist(req: Request, userId: string): Promise<Product[]> {
    try {
      this.validateMongoId(userId);

      const user = await this.findById(req, userId);

      const wishlistIds = user?.wishlist;

      if (!wishlistIds || wishlistIds.length === 0) {
        return [];
      }

      const products = await this.productModel
        .find({
          _id: { $in: wishlistIds },
        })
        .exec();

      return products;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to retrieve wishlist products',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while retrieving the wishlist.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Adds a product to a user's wishlist.
   * @param req - The request object, used for logging.
   * @param userId - The user's ID.
   * @param productId - The product ID to add.
   * @returns The updated user with the modified wishlist.
   * @throws NotFoundException if the product does not exist.
   */
  async addToWishlist(
    req: Request,
    userId: string,
    productId: string,
  ): Promise<User> {
    try {
      this.validateMongoId(userId);
      this.validateMongoId(productId);

      const user = await this.userModel.findById(userId);

      const productExists = await this.productModel.exists({ _id: productId });

      if (!productExists) {
        throw new NotFoundException('Product not found');
      }

      const objectId = new Types.ObjectId(productId);

      const productAlreadyInWishlist = user?.wishlist.includes(objectId);

      if (!productAlreadyInWishlist) {
        user?.wishlist.push(objectId);
      }

      return (await user?.save()) as User;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed add wishlist products',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while adding a product to the wishlist.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Removes a product from a user's wishlist.
   * @param req - The request object, used for logging.
   * @param userId - The user's ID.
   * @param productId - The product ID to remove.
   * @returns The updated user with the modified wishlist.
   */
  async removeFromWishlist(
    req: Request,
    userId: string,
    productId: string,
  ): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);

      if (user) {
        user.wishlist = user.wishlist.filter((id) => !id.equals(productId));
      }

      return (await user?.save()) as User;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed remove wishlist products',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while removing a product to the wishlist.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
