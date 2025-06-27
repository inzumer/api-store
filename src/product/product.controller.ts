/** Nest */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';

/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';

/** Commons */
import {
  PartialProductExample,
  ProductExample,
  SoftDeleteExample,
  UpdateProductExample,
} from '../common/examples/product.example';

/** Product dependencies */
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

/** Express */
import { Request } from 'express';

/** Decorators */
import { CommonHeaders } from '../common/decorators';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new product' })
  @CommonHeaders()
  @ApiBody({
    type: ProductDto,
    required: true,
    description: 'Product data to be created',
    examples: {
      validRequest: {
        summary: 'Valid request example',
        description: 'A typical product creation payload',
        value: PartialProductExample,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      example: ProductExample,
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
    description: 'Internal server error during product creation',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while creating the product.',
        error: 'Internal Server Error',
      },
    },
  })
  createProduct(@Req() req: Request, @Body() product: ProductDto) {
    return this.productService.createProduct(req, product);
  }

  @Get('/get-by-id/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiHeader({
    name: 'request-id',
    description: 'Unique request identifier to trace requests across services',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    schema: {
      example: ProductExample,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or invalid ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID "665b98d80218f84b8a62c2e9" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while retrieving product',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while retrieving the product.',
        error: 'Internal Server Error',
      },
    },
  })
  gettById(@Req() req: Request, @Param('id') id: string) {
    return this.productService.getProductById(req, id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Permanently delete a product by ID' })
  @CommonHeaders()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    schema: {
      example: {
        message: 'Product deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or invalid ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID "665b98d80218f84b8a62c2e7" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while deleting product',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while deleting the product.',
        error: 'Internal Server Error',
      },
    },
  })
  deleteProduct(@Req() req: Request, @Param('id') id: string) {
    return this.productService.deleteProduct(req, id);
  }

  @Put('/soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete a product (sets is_active to false)' })
  @CommonHeaders()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Product soft-deleted successfully',
    schema: {
      example: SoftDeleteExample,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or invalid product ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID "665b98d80218f84b8a62c2e7" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while soft-deleting the product',
    schema: {
      example: {
        statusCode: 500,
        message:
          'An unexpected error occurred while soft-deleting the product.',
        error: 'Internal Server Error',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async softDelete(@Req() req: Request, @Param('id') id: string) {
    return this.productService.softDeleteProduct(req, id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update product by ID' })
  @CommonHeaders()
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({
    type: ProductDto,
    description: 'Partial update data',
    required: true,
    examples: {
      validRequest: {
        summary: 'Valid request example',
        description: 'A typical product updated payload',
        value: {
          description: 'Update description for the product.',
          stock: 100,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      example: UpdateProductExample,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or invalid product ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID "665b98d80218f84b8a62c2e7" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during product update',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while updating the product.',
        error: 'Internal Server Error',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProduct(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateData: Partial<ProductDto>,
  ) {
    return this.productService.updateProduct(req, id, updateData);
  }
}
