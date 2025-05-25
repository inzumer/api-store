import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  async createOrder(
    @Body()
    orderData: {
      amount: number;
      currency: string;
      description: string;
    },
  ) {
    return this.paypalService.createOrder(orderData);
  }

  @Post('capture-order/:orderId')
  async captureOrder(@Param('orderId') orderId: string) {
    return this.paypalService.captureOrder(orderId);
  }
}
