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
import { CommonHeaders, CommonHeadersWithToken } from '../common/decorators';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new product' })
  @CommonHeadersWithToken()
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
  createProduct(@Req() req: Request, @Body() product: ProductDto) {
    return this.productService.createProduct(req, product);
  }

  @Get('/get-by-id/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @CommonHeaders()
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
  gettById(@Req() req: Request, @Param('id') id: string) {
    return this.productService.getProductById(req, id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Permanently delete a product by ID' })
  @CommonHeadersWithToken()
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
  deleteProduct(@Req() req: Request, @Param('id') id: string) {
    return this.productService.deleteProduct(req, id);
  }

  @Put('/soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete a product (sets is_active to false)' })
  @CommonHeadersWithToken()
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
  async softDelete(@Req() req: Request, @Param('id') id: string) {
    return this.productService.softDeleteProduct(req, id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update product by ID' })
  @CommonHeadersWithToken()
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
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateData: Partial<ProductDto>,
  ) {
    return this.productService.updateProduct(req, id, updateData);
  }
}
