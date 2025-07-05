/** Nest */
import { Test, TestingModule } from '@nestjs/testing';

/** Cart dependencies  */
import { CartController } from '../../src/modules/cart/cart.controller';
import { CartService } from '../../src/modules/cart/cart.service';

/** Mocks */
import { mockRequest, userId, productId } from './cart.mock';

describe('CartController', () => {
  let controller: CartController;

  const mockCartService = {
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    getCart: jest.fn(),
    updateCartProduct: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  describe('addProductToCart', () => {
    it('addProductToCart should call service and return updated cart', async () => {
      const expected = { cart: [{ productId, quantity: 2 }] };
      mockCartService.addToCart.mockResolvedValue(expected);

      const result = await controller.addProductToCart(
        mockRequest,
        userId,
        productId,
        2,
      );

      expect(mockCartService.addToCart).toHaveBeenCalledWith(
        mockRequest,
        userId,
        productId,
        2,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('deleteProductFromCart', () => {
    it('removeProductFromCart should call service and return updated cart', async () => {
      const expected = { cart: [] };
      mockCartService.removeFromCart.mockResolvedValue(expected);

      const result = await controller.removeProductFromCart(
        mockRequest,
        userId,
        productId,
      );

      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(
        mockRequest,
        userId,
        productId,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('getAllCart', () => {
    it('getCart should call service and return cart items', async () => {
      const expected = [{ _id: productId, name: 'Product' }];
      mockCartService.getCart.mockResolvedValue(expected);

      const result = await controller.getCart(mockRequest, userId);

      expect(mockCartService.getCart).toHaveBeenCalledWith(mockRequest, userId);
      expect(result).toEqual(expected);
    });
  });

  describe('updateCart', () => {
    it('updateCart should call service and return updated cart', async () => {
      const expected = { cart: [{ productId, quantity: 5 }] };
      mockCartService.updateCartProduct.mockResolvedValue(expected);

      const result = await controller.updateCart(
        mockRequest,
        userId,
        productId,
        5,
      );

      expect(mockCartService.updateCartProduct).toHaveBeenCalledWith(
        mockRequest,
        userId,
        productId,
        5,
      );
      expect(result).toEqual(expected);
    });
  });
});
