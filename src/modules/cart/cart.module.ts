/** Cart dependencies */
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

/** Schema */
import { User, UserSchema } from '../user/schema/user.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';

/** Modules */
import { UserModule } from '../user/user.module';

/** Nest */
import { Module } from '@nestjs/common';

/** Mongoose */
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
