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
import { CommonHeadersWithToken } from '../common/decorators';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/by-name/:name')
  @ApiOperation({ summary: 'Get product by name' })
  @CommonHeadersWithToken()
  @ApiParam({ name: 'name', type: String, description: 'Product name' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  getByName(@Req() req: Request, @Param('name') name: string) {
    return this.searchService.findByName(req, name);
  }

  @Get('/by-category/:id')
  @ApiOperation({ summary: 'Get all products by category ID' })
  @CommonHeadersWithToken()
  @ApiParam({ name: 'id', type: String, description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  async getProductsByCategory(@Req() req: Request, @Param('id') id: string) {
    return this.searchService.getProductsByCategory(req, id);
  }

  @Get('/by-owner/:id')
  @ApiOperation({ summary: 'Get all products by owner ID' })
  @CommonHeadersWithToken()
  @ApiParam({ name: 'id', type: String, description: 'Owner (User) ID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [ProductExample],
    },
  })
  async getProductsByOwner(@Req() req: Request, @Param('id') id: string) {
    return this.searchService.findByOwner(req, id);
  }
}
