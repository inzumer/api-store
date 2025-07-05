/** Nest */
import { Test, TestingModule } from '@nestjs/testing';

/** Wishlist dependencies */
import { WishlistController } from '../../src/modules/wishlist/wishlist.controller';
import { WishlistService } from '../../src/modules/wishlist/wishlist.service';

/** Mocks */
import {
  mockRequest,
  userId,
  productId,
  mockService,
  mockWishlistWithProduct,
  mockWishlistEmpty,
  mockProduct,
} from './ wishlist.mocks';

describe('WishlistController', () => {
  let controller: WishlistController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [{ provide: WishlistService, useValue: mockService }],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
  });

  describe('addProductToWishlist', () => {
    it('should call service.addToWishlist and return result', async () => {
      mockService.addToWishlist.mockResolvedValue(mockWishlistWithProduct);

      const result = await controller.addProductToWishlist(
        mockRequest,
        userId,
        productId,
      );

      expect(mockService.addToWishlist).toHaveBeenCalledWith(
        mockRequest,
        userId,
        productId,
      );
      expect(result).toEqual(mockWishlistWithProduct);
    });
  });

  describe('removeProductFromWishlist', () => {
    it('should call service.removeFromWishlist and return result', async () => {
      mockService.removeFromWishlist.mockResolvedValue(mockWishlistEmpty);

      const result = await controller.removeProductFromWishlist(
        mockRequest,
        userId,
        productId,
      );

      expect(mockService.removeFromWishlist).toHaveBeenCalledWith(
        mockRequest,
        userId,
        productId,
      );
      expect(result).toEqual(mockWishlistEmpty);
    });
  });

  describe('getWishlist', () => {
    it('should call service.getWishlist and return result', async () => {
      mockService.getWishlist.mockResolvedValue([mockProduct]);

      const result = await controller.getWishlist(mockRequest, userId);

      expect(mockService.getWishlist).toHaveBeenCalledWith(mockRequest, userId);
      expect(result).toEqual([mockProduct]);
    });
  });
});
