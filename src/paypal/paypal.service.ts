import { Injectable } from '@nestjs/common';
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from '@paypal/paypal-server-sdk';

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID ?? '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET ?? '',
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

const ordersController = new OrdersController(client);

@Injectable()
export class PaypalService {
  constructor() {}

  async createOrder(orderData: {
    amount: number;
    currency: string;
    description: string;
  }) {
    const { amount, currency, description } = orderData;
    const amountValue = amount.toString();
    console.log(amountValue);
    console.log(currency);
    console.log(description);

    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: '100.00',
            },
          },
        ],
      },
      prefer: 'return=minimal',
    };

    try {
      const { body, ...httpResponse } =
        await ordersController.createOrder(collect);
      // Get more response info...
      // const { statusCode, headers } = httpResponse;
      return {
        jsonResponse: body,
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // const { statusCode, headers } = error;
        throw new Error(error.message);
      }
    }
  }

  async captureOrder(orderId: string) {
    const collect = {
      id: orderId,
      prefer: 'return=minimal',
    };

    try {
      const { body, ...httpResponse } =
        await ordersController.captureOrder(collect);
      // Get more response info...
      // const { statusCode, headers } = httpResponse;
      return {
        jsonResponse: body,
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // const { statusCode, headers } = error;
        throw new Error(error.message);
      }
    }
  }
}
