/** Schema */
import { User, UserDocument } from '../user/schema';
import { Product, ProductDocument } from '../product/schema';

/** Mongoose */
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

/** Services */
import { UserService } from '../user';

/** DTO */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CartService extends UserService {
  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    super(userModel);
  }

  /**
   * Retrieves the list of products in a user's cart.
   * @param userId - The user's ID.
   * @returns An array of products in the cart.
   * @throws BadRequestException if a query error occurs.
   */
  async getCart(userId: string): Promise<Product[]> {
    try {
      this.validateMongoId(userId);

      const user = await this.userModel
        .findById(userId)
        .populate('cart')
        .exec();

      console.log('User Cart:', user?.cart);

      const cartIds = user?.cart;

      if (!cartIds || cartIds.length === 0) {
        console.log('Cart is empty');
        return [];
      }

      const products = await this.productModel
        .find({
          _id: { $in: cartIds.map((item) => item.productId) },
        })
        .exec();

      return products;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Adds a product to a user's cart or updates its quantity if it already exists.
   * @param userId - The user's ID.
   * @param productId - The product ID to add.
   * @param quantity - The quantity to add.
   * @returns The updated user with the modified cart.
   * @throws NotFoundException if the product does not exist.
   * @throws BadRequestException if a query error occurs.
   */
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<User> {
    try {
      this.validateMongoId(userId);
      this.validateMongoId(productId);

      const user = await this.userModel.findById(userId);

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
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Removes a product from a user's cart.
   * @param userId - The user's ID.
   * @param productId - The product ID to remove.
   * @returns The updated user with the modified cart.
   * @throws BadRequestException if a query error occurs.
   */
  async removeFromCart(userId: string, productId: string): Promise<User> {
    try {
      this.validateMongoId(userId);
      this.validateMongoId(productId);

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { cart: { productId: new Types.ObjectId(productId) } } },
        { new: true },
      );

      return updatedUser as User;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Updates the quantity of a product in a user's cart.
   * @param userId - The user's ID.
   * @param productId - The product ID to update.
   * @param quantity - The new quantity to set.
   * @returns The updated user with the modified cart.
   * @throws BadRequestException if the quantity is not valid or a query error occurs.
   */
  async updateCartProduct(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<User> {
    try {
      this.validateMongoId(userId);
      this.validateMongoId(productId);

      if (quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      const user = await this.userModel.findById(userId);

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
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }
}
