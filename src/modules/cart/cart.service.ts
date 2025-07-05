/** Nest */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/** Schema */
import { User, UserDocument } from '../user/schema';
import { Product, ProductDocument } from '../product/schema';

/** Mongoose */
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

/** Services */
import { UserService } from '../user/user.service';

/** Logger */
import { LoggerService } from '../../common/logger';

/** Express */
import { Request } from 'express';

@Injectable()
export class CartService {
  logger = new LoggerService('CartService');

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly userService: UserService,
  ) {}

  /**
   * Retrieves the list of products in a user's cart.
   * @param req - The request object, used for logging.
   * @param userId - The user's ID.
   * @returns An array of products in the cart.
   */
  async getCart(req: Request, userId: string): Promise<Product[]> {
    try {
      this.userService.validateMongoId(userId);

      const user = await this.userModel
        .findById(userId)
        .populate('cart')
        .exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const cartIds = user?.cart;

      if (!cartIds || cartIds.length === 0) {
        return [];
      }

      const products = await this.productModel
        .find({
          _id: { $in: cartIds.map((item) => item.productId) },
        })
        .exec();

      return products;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to retrieve cart',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while retrieving the cart.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Adds a product to a user's cart or updates its quantity if it already exists.
   * @param req - The request object, used for logging.
   * @param userId - The user's ID.
   * @param productId - The product ID to add.
   * @param quantity - The quantity to add.
   * @returns The updated user with the modified cart.
   * @throws NotFoundException if the product does not exist.
   */
  async addToCart(
    req: Request,
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<User> {
    try {
      this.userService.validateMongoId(userId);
      this.userService.validateMongoId(productId);

      const user = await this.userService.findById(req, userId);

      const productExists = await this.productModel.exists({ _id: productId });

      if (!productExists) {
        throw new NotFoundException('Product not found');
      }

      const index = user?.cart.findIndex((item) =>
        item.productId.equals(productId),
      );

      const cart = user?.cart ? [...user.cart] : [];

      if (index !== undefined && index !== -1 && cart[index]) {
        cart[index].quantity += quantity;
      } else {
        cart.push({ productId: new Types.ObjectId(productId), quantity });
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, { cart }, { new: true })
        .exec();

      return updatedUser as User;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to add product to cart',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while adding the product to cart.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Removes a product from a user's cart.
   * @param req - The request object, used for logging.
   * @param userId - The user's ID.
   * @param productId - The product ID to remove.
   * @returns The updated user with the modified cart.
   */
  async removeFromCart(
    req: Request,
    userId: string,
    productId: string,
  ): Promise<User> {
    try {
      this.userService.validateMongoId(userId);
      this.userService.validateMongoId(productId);

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { cart: { productId: new Types.ObjectId(productId) } } },
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return updatedUser as User;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to remove product from cart',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while removing the product from cart.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates the quantity of a product in a user's cart.
   * @param req - The request object, used for logging.
   * @param userId - The user's ID.
   * @param productId - The product ID to update.
   * @param quantity - The new quantity to set.
   * @returns The updated user with the modified cart.
   * @throws BadRequestException if the quantity is not valid or a query error occurs.
   */
  async updateCartProduct(
    req: Request,
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<User> {
    try {
      this.userService.validateMongoId(userId);
      this.userService.validateMongoId(productId);

      if (quantity <= 0) {
        throw new BadRequestException(
          `Invalid quantity "${quantity}". It must be greater than 0.`,
        );
      }

      const user = await this.userService.findById(req, userId);

      const index = user?.cart.findIndex(
        (item) => item.productId.toString() === productId,
      );

      const cart = user?.cart ? [...user.cart] : [];

      if (index !== undefined && index !== -1 && cart[index]) {
        cart[index].quantity = quantity;
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, { cart }, { new: true })
        .exec();

      return updatedUser as User;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Cart update failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while updating the cart.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
