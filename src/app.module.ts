import * as dotenv from 'dotenv';
dotenv.config();

/** Nest Imports */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

/** Modules */
import { AuthModule } from './auth';
import { CategoryModule } from './category';
import { ProductModule } from './product';
import { SearchModule } from './search';
import { UsersModule } from './users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?${process.env.MONGO_OPTIONS}`,
    ),
    AuthModule,
    CategoryModule,
    ProductModule,
    SearchModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
