/** Nest */
import {
  Controller,
  Get,
  // Post,
  // Put,
  // Delete,
  // Body,
  Param,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';

import { ApiCommonError } from '../common/decorators/swagger.decorators';

/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  // ApiBody,
} from '@nestjs/swagger';

/** Commons */
import { ProductExample } from '../common/examples/product.example';

/** Product dependencies */
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/get-by-name/:name')
  @ApiOperation({ summary: 'Get product by name' })
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
    description: 'Product with name not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with name not found',
        error: 'Not Found',
      },
    },
  })
  getByName(@Param('name') name: string) {
    return this.searchService.findByName(name);
  }

  @Get('/get-by-category/:id')
  @ApiOperation({ summary: 'Get all products by category ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  @ApiCommonError('Category')
  async getProductsByCategory(@Param('id') id: string) {
    return this.searchService.getProductsByCategory(id);
  }

  @Get('/get-by-owner/:id')
  @ApiOperation({ summary: 'Get all products by owner ID' })
  @ApiParam({ name: 'id', type: String, description: 'Owner (User) ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  @ApiCommonError('Owner')
  async getProductsByOwner(@Param('id') id: string) {
    return this.searchService.findByOwner(id);
  }
}
