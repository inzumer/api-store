/** Nest */
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/** Schema */
import { Category, CategoryDocument } from '../category/schema/category.schema';
import { Product, ProductDocument } from './schema/product.schema';

/** Mongoose */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/** Class validator */
import { isMongoId } from 'class-validator';

/** DTO */
import { ProductDto } from './dto/product.dto';

/** Express */
import { Request } from 'express';

/** Logger */
import { LoggerService } from '../common/logger';

@Injectable()
export class ProductService {
  logger = new LoggerService('ProductService');

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Creates a new product linked to an existing category.
   * @param req - The request object, used for logging.
   * @param product - Product data to be created.
   * @returns The newly created product.
   * @throws NotFoundException if the category does not exist.
   */
  async createProduct(req: Request, product: ProductDto): Promise<Product> {
    try {
      const categoryExists = await this.categoryModel.exists({
        _id: product.category_id,
      });

      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }

      const createdProduct = new this.productModel(product);

      return createdProduct.save();
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product creation failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while creating the product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves a product by its ID.
   * @param req - The request object, used for logging.
   * @param productId - The ID of the product to retrieve.
   * @returns The found product.
   * @throws NotFoundException if the ID is invalid.
   * @throws NotFoundException if the product is not found.
   */
  async getProductById(req: Request, productId: string): Promise<Product> {
    try {
      if (!isMongoId(productId)) {
        throw new NotFoundException('Invalid product ID');
      }

      const product = await this.productModel.findById(productId).exec();

      if (!product) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      return product;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product lookup by ID failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while retrieving the product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates an existing product with partial data.
   * @param req - The request object, used for logging.
   * @param productId - The ID of the product to update.
   * @param updateData - Partial data to update the product.
   * @returns The updated product.
   * @throws NotFoundException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async updateProduct(
    req: Request,
    productId: string,
    updateData: Partial<ProductDto>,
  ): Promise<Product> {
    try {
      if (!isMongoId(productId)) {
        throw new NotFoundException('Invalid product ID');
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(productId, updateData, { new: true })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      return updatedProduct;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product update failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while updating the product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Performs a soft delete by setting the product as inactive.
   * @param req - The request object, used for logging.
   * @param productId - The ID of the product to soft delete.
   * @returns Product update with soft deleted.
   * @throws NotFoundException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async softDeleteProduct(req: Request, productId: string): Promise<Product> {
    try {
      if (!isMongoId(productId)) {
        throw new NotFoundException('Invalid product ID');
      }

      const softDeletedProduct = await this.productModel
        .findByIdAndUpdate(productId, { is_active: false }, { new: true })
        .exec();

      if (!softDeletedProduct) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      return softDeletedProduct;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product soft delete failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while soft-deleting the product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Permanently deletes a product from the database.
   * @param req - The request object, used for logging.
   * @param productId - The ID of the product to delete.
   * @returns A message from deleted.
   * @throws NotFoundException if the ID is invalid.
   */
  async deleteProduct(
    req: Request,
    productId: string,
  ): Promise<{ message: string }> {
    try {
      if (!isMongoId(productId)) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      await this.productModel.findByIdAndDelete(productId).exec();

      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Product deletion failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while deleting the product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
