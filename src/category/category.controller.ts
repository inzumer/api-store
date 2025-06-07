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
} from '@nestjs/common';

/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

/** Commons */
import { ApiCommonError } from '../common/decorators/swagger.decorators';
import {
  CategoryExample,
  PartialCategoryExample,
  UpdateCategoryExample,
  SoftDeleteExample,
} from '../common/examples/category.example';

/** Product dependencies */
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new category' })
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
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['name must be a string', 'description must be a string'],
        error: 'Bad Request',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createCategory(@Body() categoryData: CategoryDto) {
    return this.categoryService.createCategory(categoryData);
  }

  @Get('/get-by-id/:id')
  @ApiOperation({ summary: 'Get category by ID' })
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
  @ApiCommonError('Category')
  @ApiParam({ name: 'id', required: true })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Get('/get-all')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of active categories returned successfully',
    schema: {
      example: [CategoryExample],
    },
  })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update a category by ID' })
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
  @ApiCommonError('Category')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateCategory(
    @Param('id') id: string,
    @Body() updateData: Partial<CategoryDto>,
  ) {
    return this.categoryService.updateCategory(id, updateData);
  }

  @Put('/soft-delete/:id')
  @ApiOperation({
    summary: 'Soft delete a category by ID (sets is_active to false)',
  })
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
  @ApiCommonError('Category')
  async softDeleteCategory(@Param('id') id: string) {
    return this.categoryService.softDeleteCategory(id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Permanently delete a category by ID' })
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
  @ApiCommonError('Category')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
