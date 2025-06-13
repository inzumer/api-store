/** Schemas */
import { Product, ProductSchema } from '../product/schema/product.schema';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { User, UserSchema } from '../user/schema/user.schema';

/** Modules */
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

/** Mongoose */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/** Search Dependencies */
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    ProductModule,
    UserModule,
    CategoryModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
