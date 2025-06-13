/** Nest */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/** Review dependencies */
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

import { User, UserSchema } from '../user/schema/user.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';

@Module({
  imports: [
    UserModule,
    ProductModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
