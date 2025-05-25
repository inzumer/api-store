import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/paypal-server-sdk';

@Injectable()
export class PaypalService {
  private paypalClient: paypal.core.PayPalHttpClient;

  constructor() {
    const environment = process.env.NODE_ENV === 'production'
      ? new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        )
      : new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        );

    this.paypalClient = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(orderData: {
    amount: number;
    currency: string;
    description: string;
  }) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount.toString(),
        },
        description: orderData.description,
      }],
    });

    try {
      const order = await this.paypalClient.execute(request);
      return order.result;
    } catch (err) {
      throw new Error(`Error creating PayPal order: ${err.message}`);
    }
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const capture = await this.paypalClient.execute(request);
      return capture.result;
    } catch (err) {
      throw new Error(`Error capturing PayPal order: ${err.message}`);
    }
  }

  async getOrder(orderId: string) {
    const request = new paypal.orders.OrdersGetRequest(orderId);

    try {
      const order = await this.paypalClient.execute(request);
      return order.result;
    } catch (err) {
      throw new Error(`Error getting PayPal order: ${err.message}`);
    }
  }
} 