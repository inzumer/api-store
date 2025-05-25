import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { ProductModule } from './product';
import { SearchModule } from './search';
import { UsersModule } from './users';
import { PaypalModule } from './paypal/paypal.module';

@Module({
  imports: [AuthModule, ProductModule, SearchModule, UsersModule, PaypalModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
