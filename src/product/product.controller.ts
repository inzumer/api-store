import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  hello() {
    return 'Hello World!';
  }

  @Post('/create')
  create(@Body('product') product: string) {
    return this.productService.createProduct(product);
  }

  @Get('/read')
  read(@Body('product') product: string) {
    return this.productService.getProduct(product);
  }

  @Patch('/update')
  update(@Body('product') product: string) {
    return this.productService.updateProduct(product);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
