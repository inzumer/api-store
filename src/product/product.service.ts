/** Nest */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
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

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Creates a new product linked to an existing category.
   *
   * @param product - Product data to be created.
   * @returns The newly created product.
   * @throws NotFoundException if the category does not exist.
   */
  async createProduct(product: ProductDto): Promise<Product> {
    try {
      const categoryExists = await this.categoryModel.exists({
        _id: product.category_id,
      });

      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }

      const createdProduct = new this.productModel(product);

      return createdProduct.save();
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param productId - The ID of the product to retrieve.
   * @returns The found product.
   * @throws NotFoundException if the ID is invalid.
   * @throws NotFoundException if the product is not found.
   */
  async getProductById(productId: string): Promise<Product> {
    try {
      if (!isMongoId(productId)) {
        throw new NotFoundException('Invalid product ID');
      }

      const product = await this.productModel.findById(productId).exec();

      if (!product) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      return product;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Updates an existing product with partial data.
   *
   * @param productId - The ID of the product to update.
   * @param updateData - Partial data to update the product.
   * @returns The updated product.
   * @throws NotFoundException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async updateProduct(
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
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Performs a soft delete by setting the product as inactive.
   *
   * @param productId - The ID of the product to soft delete.
   * @returns Product update with soft deleted.
   * @throws NotFoundException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async softDeleteProduct(productId: string): Promise<Product> {
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
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Permanently deletes a product from the database.
   *
   * @param productId - The ID of the product to delete.
   * @returns A message from deleted.
   * @throws NotFoundException if the ID is invalid.
   */
  async deleteProduct(productId: string): Promise<{ message: string }> {
    try {
      if (!isMongoId(productId)) {
        throw new NotFoundException('Invalid product ID');
      }

      await this.productModel.findByIdAndDelete(productId).exec();

      return {
        message: 'Product deleted successfully',
      };
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }
}
