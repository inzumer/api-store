/** Nest */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/** Cart dependencies */
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

/** User dependencies */
import { User, UserSchema } from '../user/schema/user.schema';

/** Product dependencies */
import { Product, ProductSchema } from '../product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
