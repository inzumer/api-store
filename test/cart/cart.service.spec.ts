/** Nest */
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';

/** Mongoose */
import { getModelToken } from '@nestjs/mongoose';

/** Schemas */
import { User } from '../../src/modules/user/schema';
import { Product } from '../../src/modules/product/schema';

/** Services */
import { CartService } from '../../src/modules/cart/cart.service';
import { UserService } from '../../src/modules/user/user.service';

/** Mocks */
import {
  mockRequest,
  mockUser,
  mockProduct,
  mockUserId,
  mockProductId,
} from './cart.mock';

describe('CartService', () => {
  let service: CartService;

  const mockUserModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockProductModel = {
    find: jest.fn(),
    exists: jest.fn(),
  };

  const mockUserService = {
    validateMongoId: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Product.name), useValue: mockProductModel },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  const setupFindByIdPopulate = (returnValue: any) => {
    mockUserModel.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(returnValue),
      }),
    });
  };

  describe('getCart', () => {
    it('should return products in cart', async () => {
      setupFindByIdPopulate(mockUser);
      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockProduct]),
      });

      const result = await service.getCart(mockRequest, mockUserId);
      expect(result).toEqual([mockProduct]);
    });

    it('should return empty array if no cart items', async () => {
      setupFindByIdPopulate({ cart: [] });

      const result = await service.getCart(mockRequest, mockUserId);
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.validateMongoId.mockImplementation(() => {});
      setupFindByIdPopulate(null);

      await expect(service.getCart(mockRequest, mockUserId)).rejects.toThrow(
        new NotFoundException(`User with ID ${mockUserId} not found`),
      );
    });

    it('should throw HttpException for unexpected errors', async () => {
      const error = new Error('DB down');
      mockUserService.validateMongoId.mockImplementation(() => {});
      mockUserModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(error),
        }),
      });

      await expect(service.getCart(mockRequest, mockUserId)).rejects.toThrow(
        new HttpException(
          'An unexpected error occurred while retrieving the cart.',
          500,
        ),
      );
    });
  });

  describe('addToCart', () => {
    it('should add product to cart', async () => {
      mockProductModel.exists.mockResolvedValue(true);
      mockUserService.findById.mockResolvedValue({ ...mockUser, cart: [] });
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.addToCart(
        mockRequest,
        mockUserId,
        mockProductId,
        2,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw if product not found', async () => {
      mockProductModel.exists.mockResolvedValue(false);
      mockUserService.findById.mockResolvedValue(mockUser);

      await expect(
        service.addToCart(mockRequest, mockUserId, mockProductId, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockUserService.validateMongoId.mockImplementation(() => {});
      mockUserService.findById.mockResolvedValue({ cart: [] });
      mockProductModel.exists.mockResolvedValue(false);

      await expect(
        service.addToCart(mockRequest, mockUserId, mockProductId, 1),
      ).rejects.toThrow(new NotFoundException('Product not found'));
    });

    it('should throw HttpException for unexpected errors', async () => {
      const error = new Error('Boom');
      mockUserService.validateMongoId.mockImplementation(() => {});
      mockUserService.findById.mockRejectedValue(error);

      await expect(
        service.addToCart(mockRequest, mockUserId, mockProductId, 1),
      ).rejects.toThrow(
        new HttpException(
          'An unexpected error occurred while adding the product to cart.',
          500,
        ),
      );
    });

    it('should increase quantity if product already exists in cart', async () => {
      const mockUserWithCart = {
        _id: mockUserId,
        cart: [
          {
            productId: { equals: jest.fn().mockReturnValue(true) },
            quantity: 1,
          },
        ],
      };

      mockUserService.validateMongoId.mockImplementation(() => {});
      mockUserService.findById.mockResolvedValue(mockUserWithCart);
      mockProductModel.exists.mockResolvedValue(true);
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockUserWithCart,
          cart: [
            {
              productId: mockProductId,
              quantity: 3,
            },
          ],
        }),
      });

      const result = await service.addToCart(
        mockRequest,
        mockUserId,
        mockProductId,
        2,
      );

      expect(result.cart[0].quantity).toBe(3);
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValueOnce(mockUser);

      const result = await service.removeFromCart(
        mockRequest,
        mockUserId,
        mockProductId,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.validateMongoId.mockImplementation(() => {});
      mockUserModel.findByIdAndUpdate.mockResolvedValue(undefined);

      await expect(
        service.removeFromCart(mockRequest, mockUserId, mockProductId),
      ).rejects.toThrow(
        new NotFoundException(`User with ID ${mockUserId} not found`),
      );
    });

    it('should throw HttpException for unexpected errors', async () => {
      const error = new Error('Database corrupted');
      mockUserService.validateMongoId.mockImplementation(() => {});
      mockUserModel.findByIdAndUpdate.mockRejectedValue(error);

      await expect(
        service.removeFromCart(mockRequest, mockUserId, mockProductId),
      ).rejects.toThrow(
        new HttpException(
          'An unexpected error occurred while removing the product from cart.',
          500,
        ),
      );
    });
  });

  describe('updateCartProduct', () => {
    it('should update product quantity', async () => {
      mockUserService.findById.mockResolvedValue({
        ...mockUser,
        cart: [{ productId: mockProductId, quantity: 1 }],
      });
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.updateCartProduct(
        mockRequest,
        mockUserId,
        mockProductId,
        3,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw on invalid quantity', async () => {
      await expect(
        service.updateCartProduct(mockRequest, mockUserId, mockProductId, 0),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if quantity <= 0', async () => {
      await expect(
        service.updateCartProduct(mockRequest, mockUserId, mockProductId, 0),
      ).rejects.toThrow(
        new BadRequestException(
          'Invalid quantity "0". It must be greater than 0.',
        ),
      );
    });

    it('should throw HttpException for unexpected errors', async () => {
      const error = new Error('Network glitch');
      mockUserService.validateMongoId.mockImplementation(() => {});
      mockUserService.findById.mockRejectedValue(error);

      await expect(
        service.updateCartProduct(mockRequest, mockUserId, mockProductId, 3),
      ).rejects.toThrow(
        new HttpException(
          'An unexpected error occurred while updating the cart.',
          500,
        ),
      );
    });
  });
});
