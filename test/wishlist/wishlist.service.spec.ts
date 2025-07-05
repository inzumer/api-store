/** Nest */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, NotFoundException, HttpStatus } from '@nestjs/common';

/** Mongoose */
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

/** Schema */
import { User } from '../../src/modules/user/schema';
import { Product } from '../../src/modules/product/schema';

/** Services */
import { WishlistService } from '../../src/modules/wishlist/wishlist.service';

/** Mocks */
import {
  mockUserId,
  mockProductId,
  mockRequest,
  mockUserBase,
  mockProduct,
  createUserWithWishlist,
} from './ wishlist.mocks';

describe('WishlistService', () => {
  let service: WishlistService;
  let userModel: { findById: jest.Mock };
  let productModel: { find: jest.Mock; exists: jest.Mock };

  beforeEach(async () => {
    userModel = {
      findById: jest.fn(),
    };

    productModel = {
      find: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Product.name), useValue: productModel },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    service.validateMongoId = jest.fn();
    service.findById = jest.fn();
  });

  describe('getWishlist', () => {
    it('should return wishlist products', async () => {
      const productIds = [mockProduct._id];

      (service.validateMongoId as jest.Mock).mockReturnValue(true);
      (service.findById as jest.Mock).mockResolvedValue(
        createUserWithWishlist(productIds),
      );

      productModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockProduct]),
      });

      const result = await service.getWishlist(mockRequest, mockUserId);

      expect(result).toEqual([mockProduct]);
    });

    it('should return empty array if wishlist is empty', async () => {
      (service.validateMongoId as jest.Mock).mockReturnValue(true);
      (service.findById as jest.Mock).mockResolvedValue(
        createUserWithWishlist([]),
      );

      const result = await service.getWishlist(mockRequest, mockUserId);
      expect(result).toEqual([]);
    });

    it('should rethrow HttpException as is', async () => {
      const httpError = new HttpException('Boom', HttpStatus.BAD_REQUEST);
      (service.validateMongoId as jest.Mock).mockImplementation(() => {
        throw httpError;
      });

      await expect(
        service.getWishlist(mockRequest, mockUserId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if something fails', async () => {
      (service.validateMongoId as jest.Mock).mockReturnValue(true);
      (service.findById as jest.Mock).mockRejectedValue(new Error('Fail'));

      await expect(
        service.getWishlist(mockRequest, mockUserId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('addToWishlist', () => {
    it('should add product to wishlist and save', async () => {
      const user = createUserWithWishlist([]);
      userModel.findById.mockResolvedValue(user);
      productModel.exists.mockResolvedValue(true);
      (service.validateMongoId as jest.Mock).mockReturnValue(true);

      const result = await service.addToWishlist(
        mockRequest,
        mockUserId,
        mockProductId,
      );

      expect(result.wishlist.length).toBe(1);
    });

    it('should not add duplicate products', async () => {
      const objectId = new Types.ObjectId(mockProductId);
      const user = createUserWithWishlist([objectId]);
      userModel.findById.mockResolvedValue(user);
      productModel.exists.mockResolvedValue(true);
      (service.validateMongoId as jest.Mock).mockReturnValue(true);

      const result = await service.addToWishlist(
        mockRequest,
        mockUserId,
        objectId.toHexString(),
      );

      expect(result.wishlist.length).toBe(2);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      (service.validateMongoId as jest.Mock).mockReturnValue(true);
      userModel.findById.mockResolvedValue(mockUserBase);
      productModel.exists.mockResolvedValue(false);

      await expect(
        service.addToWishlist(mockRequest, mockUserId, mockProductId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rethrow HttpException', async () => {
      const error = new HttpException('Manual fail', HttpStatus.CONFLICT);
      (service.validateMongoId as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(
        service.addToWishlist(mockRequest, mockUserId, mockProductId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException on DB error', async () => {
      (service.validateMongoId as jest.Mock).mockReturnValue(true);
      userModel.findById.mockRejectedValue(new Error('DB exploded'));

      await expect(
        service.addToWishlist(mockRequest, mockUserId, mockProductId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove product from wishlist and save', async () => {
      const objectId = new Types.ObjectId(mockProductId);

      const user = {
        ...mockUserBase,
        wishlist: [objectId],
        save: jest.fn().mockImplementation(function (this: typeof user) {
          this.wishlist = [];
          return Promise.resolve(this);
        }),
      };

      userModel.findById.mockResolvedValue(user);

      const result = await service.removeFromWishlist(
        mockRequest,
        mockUserId,
        objectId.toHexString(),
      );

      expect(result.wishlist).toEqual([]);
    });

    it('should not fail if user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      const result = await service.removeFromWishlist(
        mockRequest,
        mockUserId,
        mockProductId,
      );
      expect(result).toBeUndefined();
    });

    it('should rethrow HttpException', async () => {
      const httpError = new HttpException('Another fail', HttpStatus.CONFLICT);
      userModel.findById.mockImplementation(() => {
        throw httpError;
      });

      await expect(
        service.removeFromWishlist(mockRequest, mockUserId, mockProductId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if DB fails', async () => {
      userModel.findById.mockRejectedValue(new Error('DB error'));

      await expect(
        service.removeFromWishlist(mockRequest, mockUserId, mockProductId),
      ).rejects.toThrow(HttpException);
    });
  });
});
