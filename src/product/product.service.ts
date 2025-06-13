/** Class validator */
import { isMongoId } from 'class-validator';

/** Mongoose */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/** Nest */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

/** Product DTOs */
import { ProductDto } from './dto/product.dto';

/** Category schema */
import { Category, CategoryDocument } from '../category/schema/category.schema';

/** Product schema */
import { Product, ProductDocument } from './schema/product.schema';

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
   * @throws NotFoundException if the category does not exist.
   * @returns The newly created product.
   */
  async createProduct(product: ProductDto): Promise<Product> {
    const categoryExists = await this.categoryModel.exists({
      _id: product.category_id,
    });

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    const createdProduct = new this.productModel(product);

    return createdProduct.save();
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param productId - The ID of the product to retrieve.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the product is not found.
   * @returns The found product.
   */
  async getProductById(productId: string): Promise<Product> {
    if (!isMongoId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    return product;
  }

  /**
   * Updates an existing product with partial data.
   *
   * @param productId - The ID of the product to update.
   * @param updateData - Partial data to update the product.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   * @returns The updated product.
   */
  async updateProduct(
    productId: string,
    updateData: Partial<ProductDto>,
  ): Promise<Product> {
    if (!isMongoId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(productId, updateData, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    return updatedProduct;
  }

  /**
   * Performs a soft delete by setting the product as inactive.
   *
   * @param productId - The ID of the product to soft delete.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async softDeleteProduct(productId: string): Promise<Product> {
    if (!isMongoId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const softDeletedProduct = await this.productModel
      .findByIdAndUpdate(productId, { is_active: false }, { new: true })
      .exec();

    if (!softDeletedProduct) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    return softDeletedProduct;
  }

  /**
   * Permanently deletes a product from the database.
   *
   * @param productId - The ID of the product to delete.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async deleteProduct(productId: string): Promise<{ message: string }> {
    if (!isMongoId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const result = await this.productModel.findByIdAndDelete(productId).exec();

    if (!result) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    return {
      message: 'Product deleted successfully',
    };
  }
}
