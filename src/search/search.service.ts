/** Schema */
import { Category, CategoryDocument } from '../category/schema';
import { Product, ProductDocument } from '../product/schema';

/** Mongoose */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/** Nest */
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

/** Class validator */
import { isMongoId } from 'class-validator';

/** Express */
import { Request } from 'express';

/** Logger */
import { LoggerService } from '../common/logger';

export class SearchService {
  logger = new LoggerService('SearchService');

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Searches for products by name, case-insensitive.
   * @param req - The request object, used for logging.
   * @param name - The name or partial name to search for.
   * @returns An array of matching products.
   * @throws NotFoundException if no products are found.
   */
  async findByName(req: Request, name: string): Promise<Product[]> {
    try {
      const results = await this.productModel
        .find({ name: { $regex: name, $options: 'i' } })
        .exec();

      if (results.length === 0) {
        throw new NotFoundException(`No products found with name: "${name}"`);
      }

      return results;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product lookup failed by name',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while retrieving product data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves products by category ID.
   * @param req - The request object, used for logging.
   * @param categoryId - The ID of the category to retrieve products from.
   * @returns A list of products in the specified category.
   * @throws NotFoundException if the category ID is invalid.
   * @throws NotFoundException if the category does not exist.
   */
  async getProductsByCategory(
    req: Request,
    categoryId: string,
  ): Promise<Product[]> {
    try {
      if (!isMongoId(categoryId)) {
        throw new NotFoundException('Invalid category ID');
      }

      const categoryExists = await this.categoryModel.exists({
        _id: categoryId,
      });

      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }

      const products = await this.productModel
        .find({ category_id: categoryId, is_active: true })
        .exec();

      return products;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product lookup failed by category',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while retrieving product data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves products by owner ID.
   * @param req - The request object, used for logging.
   * @param ownerId - The ID of the user who owns the products.
   * @returns A list of products belonging to the specified owner.
   * @throws NotFoundException if the owner ID is invalid.
   */
  async findByOwner(req: Request, userId: string): Promise<Product[]> {
    try {
      if (!isMongoId(userId)) {
        throw new NotFoundException('Invalid user ID');
      }

      return this.productModel.find({ owner: userId }).exec();
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product lookup failed by owner',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while retrieving product data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
