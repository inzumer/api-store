/** Schemas */
import { User, UserSchema } from '../user/schema/user.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';

/** Wishlist Dependencies */
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

/** Nest */
import { Module } from '@nestjs/common';

/** Mongoose */
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
