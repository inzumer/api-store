import { Controller, Get, Body } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/')
  hello() {
    return 'Hello World!';
  }

  @Get('/search-product')
  searchProduct(@Body('product') product: string) {
    return this.searchService.searchProduct(product);
  }

  @Get('/search-by-category')
  searchCategory(@Body('category') category: string) {
    return this.searchService.searchProductByCategory(category);
  }

  @Get('/search-by-owner')
  searchOwner(@Body('owner') owner: string) {
    return this.searchService.searchProductByOwner(owner);
  }
}
