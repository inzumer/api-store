/** Nest */
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';

/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

/** Commons */
import {
  CategoryExample,
  PartialCategoryExample,
  UpdateCategoryExample,
  SoftDeleteExample,
} from '../common/examples/category.example';

/** Category dependencies */
import { CategoryService } from './category.service';

/** DTO */
import { CategoryDto } from './dto';

/** Express */
import { Request } from 'express';

/** Decorators */
import { CommonHeaders } from '../common/decorators';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new category' })
  @CommonHeaders()
  @ApiBody({
    type: CategoryDto,
    required: true,
    description: 'Product data to be created',
    examples: {
      validRequest: {
        summary: 'Valid request example',
        description: 'A typical category creation payload',
        value: PartialCategoryExample,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      example: CategoryExample,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Category with this name already exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Category with this name already exists',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error while creating category',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while creating the category.',
        error: 'Internal Server Error',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createCategory(@Req() req: Request, @Body() categoryData: CategoryDto) {
    return this.categoryService.createCategory(req, categoryData);
  }

  @Get('/get-by-id/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiHeader({
    name: 'request-id',
    description: 'Unique request identifier to trace requests across services',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    schema: {
      example: CategoryExample,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid or non-existing category ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID "someId" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error while retrieving category',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while retrieving the category.',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiParam({ name: 'id', required: true })
  async getCategoryById(@Req() req: Request, @Param('id') id: string) {
    return this.categoryService.getCategoryById(req, id);
  }

  @Get('/get-all')
  @ApiHeader({
    name: 'request-id',
    description: 'Unique request identifier to trace requests across services',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of active categories returned successfully',
    schema: {
      example: [CategoryExample],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error while retrieving categories',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while retrieving categories.',
        error: 'Internal Server Error',
      },
    },
  })
  async getAllCategories(@Req() req: Request) {
    return this.categoryService.getAllCategories(req);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @CommonHeaders()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
    required: true,
    examples: {
      validRequest: {
        summary: 'Valid request example',
        description: 'A typical category updated payload',
        value: {
          description: 'Updated description for the electronics category.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: {
      example: UpdateCategoryExample,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid category ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid category ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error while updating the category',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while updating the category.',
        error: 'Internal Server Error',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateCategory(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateData: Partial<CategoryDto>,
  ) {
    return this.categoryService.updateCategory(req, id, updateData);
  }

  @Put('/soft-delete/:id')
  @ApiOperation({
    summary: 'Soft delete a category by ID (sets is_active to false)',
  })
  @CommonHeaders()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Category soft-deleted successfully',
    schema: {
      example: SoftDeleteExample,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid category ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid category ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with the given ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID "60f5b8e2c1234567890abcdef" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error during category soft-delete',
    schema: {
      example: {
        statusCode: 500,
        message:
          'An unexpected error occurred while soft deleting the category.',
        error: 'Internal Server Error',
      },
    },
  })
  async softDeleteCategory(@Req() req: Request, @Param('id') id: string) {
    return this.categoryService.softDeleteCategory(req, id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Permanently delete a category by ID' })
  @CommonHeaders()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: {
      example: {
        message: 'Category deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid category ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid category ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with the given ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID "60f5b8e2c1234567890abcdef" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error during category deletion',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while deleting the category.',
        error: 'Internal Server Error',
      },
    },
  })
  async deleteCategory(@Req() req: Request, @Param('id') id: string) {
    return this.categoryService.deleteCategory(req, id);
  }
}
