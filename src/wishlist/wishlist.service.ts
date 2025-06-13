/** Nest */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

/** Mongoose */
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

/** Schema */
import { User, UserDocument } from '../user/schema';
import { Product, ProductDocument } from '../product/schema';

/** Services */
import { UserService } from '../user/user.service';

@Injectable()
export class WishlistService extends UserService {
  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    super(userModel);
  }

  /**
   * Retrieves the list of products in a user's wishlist.
   * @param userId - The user's ID.
   * @returns An array of products in the wishlist.
   * @throws BadRequestException if a query error occurs.
   */
  async getWishlist(userId: string): Promise<Product[]> {
    try {
      this.validateMongoId(userId);

      const user = await this.userModel
        .findById(userId)
        .populate('wishlist')
        .exec();

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
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Adds a product to a user's wishlist.
   * @param userId - The user's ID.
   * @param productId - The product ID to add.
   * @returns The updated user with the modified wishlist.
   * @throws NotFoundException if the product does not exist.
   * @throws BadRequestException if a query error occurs.
   */
  async addToWishlist(userId: string, productId: string): Promise<User> {
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
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Removes a product from a user's wishlist.
   * @param userId - The user's ID.
   * @param productId - The product ID to remove.
   * @returns The updated user with the modified wishlist.
   * @throws BadRequestException if a query error occurs.
   */
  async removeFromWishlist(userId: string, productId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);

      if (user) {
        user.wishlist = user.wishlist.filter((id) => !id.equals(productId));
      }

      return (await user?.save()) as User;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }
}
