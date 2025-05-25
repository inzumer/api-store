import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { ProductModule } from './product';
import { SearchModule } from './search';
import { UsersModule } from './users';

@Module({
  imports: [AuthModule, ProductModule, SearchModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
