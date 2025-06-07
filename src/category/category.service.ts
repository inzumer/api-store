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

/** Category DTOs */
import { CategoryDto } from './dto/category.dto';

/** Category schema */
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Creates a new category.
   *
   * @param categoryData - The data needed to create the category.
   * @returns The newly created category.
   */
  async createCategory(data: CategoryDto): Promise<Category> {
    const exists = await this.categoryModel.findOne({ name: data.name }).exec();

    if (exists) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = new this.categoryModel(data);

    return category.save();
  }

  /**
   * Retrieves a category by its ID.
   *
   * @param id - The ID of the category.
   * @returns The found category.
   * @throws NotFoundException if the category is not found.
   */
  async getCategoryById(id: string): Promise<Category> {
    if (!isMongoId(id)) throw new BadRequestException('Invalid category ID');

    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Retrieves all categories.
   *
   * @returns A list of all existing categories.
   */
  async getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find({ is_active: true }).exec();
  }

  /**
   * Updates a category's information.
   *
   * @param id - The ID of the category to update.
   * @param updateData - Partial data to update.
   * @returns The updated category.
   * @throws NotFoundException if the category is not found.
   */
  async updateCategory(
    id: string,
    updateData: Partial<CategoryDto>,
  ): Promise<Category> {
    if (!isMongoId(id)) {
      throw new BadRequestException('Invalid category ID');
    }

    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Category not found');
    }

    return updated;
  }

  /**
   * Performs a soft delete by setting the categories as inactive.
   *
   * @param categoryId - The ID of the product to soft delete.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async softDeleteCategory(categoryId: string): Promise<Category> {
    if (!isMongoId(categoryId)) {
      throw new BadRequestException('Invalid category ID');
    }

    const softDeletedCategory = await this.categoryModel
      .findByIdAndUpdate(categoryId, { is_active: false }, { new: true })
      .exec();

    if (!softDeletedCategory) {
      throw new NotFoundException('Category not found');
    }

    return softDeletedCategory;
  }

  /**
   * Deletes a category by ID.
   *
   * @param categoryId - The ID of the category to delete.
   * @returns A success message or deletion result.
   * @throws NotFoundException if the category is not found.
   */
  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    if (!isMongoId(categoryId)) {
      throw new BadRequestException('Invalid category ID');
    }

    const result = await this.categoryModel
      .findByIdAndDelete(categoryId)
      .exec();

    if (!result) {
      throw new NotFoundException('Category not found');
    }

    return { message: 'Category deleted successfully' };
  }
}
