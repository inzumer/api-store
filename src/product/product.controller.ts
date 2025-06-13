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
} from '@nestjs/common';

/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
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

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new product' })
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
    status: 400,
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['name must be a string', 'price must be a number'],
        error: 'Bad Request',
      },
    },
  })
  createProduct(@Body() product: ProductDto) {
    return this.productService.createProduct(product);
  }

  @Get('/get-by-id/:id')
  @ApiOperation({ summary: 'Get product by ID' })
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
  gettById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Permanently delete a product by ID' })
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
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Put('/soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete a product (sets is_active to false)' })
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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async softDelete(@Param('id') id: string) {
    return this.productService.softDeleteProduct(id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update product by ID' })
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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: Partial<ProductDto>,
  ) {
    return this.productService.updateProduct(id, updateData);
  }
}
