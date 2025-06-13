/** Review dependencies */
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

/** Modules */
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

/** Schema */
import { User, UserSchema } from '../user/schema/user.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';

/** Nest */
import { Module } from '@nestjs/common';

/** Mongoose */
import { MongooseModule } from '@nestjs/mongoose';

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
