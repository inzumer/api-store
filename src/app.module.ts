import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { ProductModule } from './product';
import { SearchModule } from './search';
import { UsersModule } from './users';
import { MongooseModule } from '@nestjs/mongoose';

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@mateandmethods.2q3ycr1.mongodb.net/?retryWrites=true&w=majority&appName=MateAndMethods`,
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
