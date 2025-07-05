/** Sentry */
import { SentryModule } from '@sentry/nestjs/setup';

/** Middlewares */
import {
  AuthMiddleware,
  RequestIdMiddleware,
  RequestAppIdMiddleware,
} from './common/middlewares';

/** Dotenv */
import * as dotenv from 'dotenv';
dotenv.config();

/** Nest Imports */
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

/** Modules */
import {
  CartModule,
  CategoryModule,
  ProductModule,
  ReviewModule,
  SearchModule,
  UserModule,
  WishlistModule,
} from './modules';

@Module({
  imports: [
    SentryModule.forRoot(),
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestAppIdMiddleware, RequestIdMiddleware)
      .exclude({ path: '/docs', method: RequestMethod.ALL })
      .forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/users/login', method: RequestMethod.POST },
        { path: '/users/create', method: RequestMethod.POST },
      )
      .forRoutes(
        { path: 'users/(.*)', method: RequestMethod.ALL },
        { path: 'whislist/(.*)', method: RequestMethod.ALL },
      );
  }
}
