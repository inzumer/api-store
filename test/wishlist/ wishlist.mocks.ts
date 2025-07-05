/** Mongoose */
import { Types } from 'mongoose';

/** Express */
import { Request } from 'express';

export const mockUserId = new Types.ObjectId().toHexString();
export const mockProductId = new Types.ObjectId().toHexString();
export const mockRequest = {} as Request;
export const userId = '64f0c0e2c8cfab001f123abc';
export const productId = '64f0c0e2c8cfab001f123def';

export const mockUserBase = {
  _id: mockUserId,
  wishlist: [],
  save: jest.fn(),
};

export const mockProduct = {
  _id: productId,
  name: 'Item 1',
};

export const createUserWithWishlist = (wishlist: any[] = []) => ({
  ...mockUserBase,
  wishlist,
  save: jest.fn().mockResolvedValue({ wishlist }),
});

export const mockWishlistWithProduct = {
  _id: userId,
  wishlist: [productId],
};

export const mockWishlistEmpty = {
  _id: userId,
  wishlist: [],
};

export const mockService = {
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
  getWishlist: jest.fn(),
};
