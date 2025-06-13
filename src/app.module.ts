import * as dotenv from 'dotenv';
dotenv.config();

/** Nest Imports */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

/** Modules */
import { CartModule } from './cart';
import { CategoryModule } from './category';
import { ProductModule } from './product';
import { ReviewModule } from './review';
import { SearchModule } from './search';
import { UserModule } from './user';
import { WishlistModule } from './wishlist';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?${process.env.MONGO_OPTIONS}`,
    ),
    CartModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
    SearchModule,
    UserModule,
    WishlistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
