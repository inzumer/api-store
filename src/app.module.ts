import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { ProductModule } from './product';
import { SearchModule } from './search';
import { UsersModule } from './users';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mateandmethods.2q3ycr1.mongodb.net/api-store?retryWrites=true&w=majority`,
    ),
    AuthModule,
    ProductModule,
    SearchModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
