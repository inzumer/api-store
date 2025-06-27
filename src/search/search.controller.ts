/** Nest */
import { Controller, Get, Param, Req } from '@nestjs/common';

/** Swagger */
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

/** Commons */
import { ProductExample } from '../common/examples/product.example';

/** Search dependencies */
import { SearchService } from './search.service';

/** Express */
import { Request } from 'express';

/** Decorators */
import { CommonHeaders } from '../common/decorators';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/by-name/:name')
  @ApiOperation({ summary: 'Get product by name' })
  @CommonHeaders()
  @ApiParam({ name: 'name', type: String, description: 'Product name' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'No products found with name: "Radio"',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected internal server error during search operation',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while retrieving product data.',
        error: 'Internal Server Error',
      },
    },
  })
  getByName(@Req() req: Request, @Param('name') name: string) {
    return this.searchService.findByName(req, name);
  }

  @Get('/by-category/:id')
  @ApiOperation({ summary: 'Get all products by category ID' })
  @CommonHeaders()
  @ApiParam({ name: 'id', type: String, description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid category ID or Category not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Invalid category ID with ID: "60c72b2f9b1e8c001c8e4d3a" or Category not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected internal server error during search operation',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while retrieving product data.',
        error: 'Internal Server Error',
      },
    },
  })
  async getProductsByCategory(@Req() req: Request, @Param('id') id: string) {
    return this.searchService.getProductsByCategory(req, id);
  }

  @Get('/by-owner/:id')
  @ApiOperation({ summary: 'Get all products by owner ID' })
  @CommonHeaders()
  @ApiParam({ name: 'id', type: String, description: 'Owner (User) ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid user ID or User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Invalid user ID',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected internal server error during search operation',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while retrieving product data.',
        error: 'Internal Server Error',
      },
    },
  })
  async getProductsByOwner(@Req() req: Request, @Param('id') id: string) {
    return this.searchService.findByOwner(req, id);
  }
}
