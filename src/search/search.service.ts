/** Class validator */
import { isMongoId } from 'class-validator';

/** Mongoose */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/** Nest */
import { BadRequestException, NotFoundException } from '@nestjs/common';

/** Category schema */
import { Category, CategoryDocument } from '../category/schema/category.schema';

/** Product schema */
import { Product, ProductDocument } from '../product/schema/product.schema';

export class SearchService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Searches for products by name, case-insensitive.
   *
   * @param name - The name or partial name to search for.
   * @throws NotFoundException if no products are found.
   * @returns An array of matching products.
   */
  async findByName(name: string): Promise<Product[]> {
    const results = await this.productModel
      .find({ name: { $regex: name, $options: 'i' } })
      .exec();

    if (results.length === 0) {
      throw new NotFoundException(`No products found with name "${name}"`);
    }

    return results;
  }

  /**
   * Retrieves products by category ID.
   *
   * @param categoryId - The ID of the category to retrieve products from.
   * @returns A list of products in the specified category.
   * @throws BadRequestException if the category ID is invalid.
   * @throws NotFoundException if the category does not exist.
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (!isMongoId(categoryId)) {
      throw new BadRequestException('Invalid category ID');
    }

    const categoryExists = await this.categoryModel.exists({ _id: categoryId });

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    const products = await this.productModel
      .find({ category_id: categoryId, is_active: true })
      .exec();

    return products;
  }

  /**
   * Retrieves products by owner ID.
   *
   * @param ownerId - The ID of the user who owns the products.
   * @returns A list of products belonging to the specified owner.
   * @throws BadRequestException if the owner ID is invalid.
   * @throws NotFoundException if no products are found for the given owner.
   */
  async findByOwner(userId: string): Promise<Product[]> {
    if (!isMongoId(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.productModel.find({ owner: userId }).exec();
  }
}
