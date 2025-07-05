/** Express */
import { Request } from 'express';

export const mockRequest = {} as Request;
export const validId = '64abc123abc123abc123abc1';
export const invalidId = 'invalid-id';

export const mockProducts = [
  { _id: '1', name: 'Test Product' },
  { _id: '2', name: 'Another Product' },
];

export const mockProductModel = {
  find: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

export const mockCategoryModel = {
  exists: jest.fn(),
};
