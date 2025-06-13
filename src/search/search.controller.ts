/** Nest */
import { Controller, Get, Param } from '@nestjs/common';

/** Swagger */
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

/** Commons */
import { ProductExample } from '../common/examples/product.example';

/** Product dependencies */
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/by-name/:name')
  @ApiOperation({ summary: 'Get product by name' })
  @ApiParam({ name: 'name', type: String, description: 'Product name' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  getByName(@Param('name') name: string) {
    return this.searchService.findByName(name);
  }

  @Get('/by-category/:id')
  @ApiOperation({ summary: 'Get all products by category ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  async getProductsByCategory(@Param('id') id: string) {
    return this.searchService.getProductsByCategory(id);
  }

  @Get('/by-owner/:id')
  @ApiOperation({ summary: 'Get all products by owner ID' })
  @ApiParam({ name: 'id', type: String, description: 'Owner (User) ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  async getProductsByOwner(@Param('id') id: string) {
    return this.searchService.findByOwner(id);
  }
}
