/** Nest */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/** Mongoose */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/** Class validator */
import { isMongoId } from 'class-validator';

/** DTO */
import { CategoryDto } from './dto/category.dto';

/** Schema */
import { Category, CategoryDocument } from './schema/category.schema';

/** Express */
import { Request } from 'express';

/** Logger */
import { LoggerService } from '../../common/logger';

@Injectable()
export class CategoryService {
  logger = new LoggerService('CategoryService');

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Creates a new category.
   * @param req - The request object, used for logging.
   * @param categoryData - The data needed to create the category.
   * @returns The newly created category.
   */
  async createCategory(req: Request, data: CategoryDto): Promise<Category> {
    try {
      const exists = await this.categoryModel
        .findOne({ name: data.name })
        .exec();

      if (exists) {
        throw new BadRequestException('Category with this name already exists');
      }

      const category = new this.categoryModel(data);

      return category.save();
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Category creation failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while creating the category.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves a category by its ID.
   * @param req - The request object, used for logging.
   * @param id - The ID of the category.
   * @returns The found category.
   * @throws NotFoundException if the category is not found.
   */
  async getCategoryById(req: Request, id: string): Promise<Category> {
    try {
      if (!isMongoId(id)) {
        throw new NotFoundException('Invalid category ID');
      }

      const category = await this.categoryModel.findById(id).exec();

      if (!category) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }

      return category;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Category retrieval failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while retrieving the category.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves all categories.
   * @param req - The request object, used for logging.
   * @returns A list of all existing categories.
   */
  async getAllCategories(req: Request): Promise<Category[]> {
    try {
      return this.categoryModel.find({ is_active: true }).exec();
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Failed to retrieve active categories',
      );

      throw new HttpException(
        'An unexpected error occurred while retrieving categories.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates a category's information.
   * @param req - The request object, used for logging.
   * @param id - The ID of the category to update.
   * @param updateData - Partial data to update.
   * @returns The updated category.
   * @throws NotFoundException if the category is not found.
   */
  async updateCategory(
    req: Request,
    id: string,
    updateData: Partial<CategoryDto>,
  ): Promise<Category> {
    try {
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
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Category update failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while updating the category.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Performs a soft delete by setting the categories as inactive.
   * @param req - The request object, used for logging.
   * @param categoryId - The ID of the product to soft delete.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the product does not exist.
   */
  async softDeleteCategory(
    req: Request,
    categoryId: string,
  ): Promise<Category> {
    try {
      if (!isMongoId(categoryId)) {
        throw new BadRequestException('Invalid category ID');
      }

      const softDeletedCategory = await this.categoryModel
        .findByIdAndUpdate(categoryId, { is_active: false }, { new: true })
        .exec();

      if (!softDeletedCategory) {
        throw new NotFoundException(
          `Category with ID "${categoryId}" not found`,
        );
      }

      return softDeletedCategory;
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Category soft delete failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while soft deleting the category.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Deletes a category by ID.
   * @param req - The request object, used for logging.
   * @param categoryId - The ID of the category to delete.
   * @returns A success message or deletion result.
   * @throws NotFoundException if the category is not found.
   */
  async deleteCategory(
    req: Request,
    categoryId: string,
  ): Promise<{ message: string }> {
    try {
      if (!isMongoId(categoryId)) {
        throw new BadRequestException('Invalid category ID');
      }

      const result = await this.categoryModel
        .findByIdAndDelete(categoryId)
        .exec();

      if (!result) {
        throw new NotFoundException(
          `Category with ID "${categoryId}" not found`,
        );
      }

      return { message: 'Category deleted successfully' };
    } catch (error) {
      this.logger.error(
        { request: req, error: error as Error },
        'Category delete failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while deleting the category.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
