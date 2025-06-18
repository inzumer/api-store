/** Product dependencies */
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

/** Nest */
import { Module } from '@nestjs/common';

/** Mongoose */
import { MongooseModule } from '@nestjs/mongoose';

/** Schema */
import { Product, ProductSchema } from './schema/product.schema';

/** Modules */
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
