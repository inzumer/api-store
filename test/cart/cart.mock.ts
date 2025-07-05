/** Mongoose */
import { Types } from 'mongoose';

/** Express */
import { Request } from 'express';

export const mockRequest = {} as Request;
export const mockUserId = new Types.ObjectId().toString();
export const mockProductId = new Types.ObjectId().toString();
export const mockProduct = { _id: mockProductId };
export const userId = 'user123';
export const productId = 'product123';

export const mockUser = {
  _id: mockUserId,
  cart: [{ productId: mockProductId, quantity: 1 }],
};
