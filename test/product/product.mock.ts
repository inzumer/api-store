/** Express */
import { Request } from 'express';

export const mockRequest = {} as Request;

export const productId = '507f1f77bcf86cd799439011';
export const invalidId = 'invalid';
export const falseProductId = '123';

export const mockProductDto = {
  category_id: 'catId',
  name: 'test',
  description: '',
  price: 0,
  images: [],
  stock: 0,
  owner: '',
  currency: 'USD' as const,
  score: 0,
  reviews: [],
};

export const mockProductInstance = {
  save: jest.fn().mockResolvedValue({ _id: productId, ...mockProductDto }),
};

export const mockProduct = {
  _id: productId,
  name: 'test',
};

export const mockUpdatedProduct = {
  _id: productId,
  name: 'updated',
};

export const mockSoftDeletedProduct = {
  _id: productId,
  is_active: false,
};

export const mockPartialProduct = {
  _id: 'mock-product-id',
  name: 'Mock Product',
  description: 'A product for testing',
  price: 10,
  stock: 5,
  is_active: true,
};
