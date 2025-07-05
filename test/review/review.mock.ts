/** Express */
import { Request } from 'express';

/** Mongoose */
import { Types } from 'mongoose';

/** DTO */
import { ReviewDto } from '../../src/modules/review/dto/review.dto';

export const req = {} as Request;

export const productId = 'product123';
export const userId = 'user123';

export const reviewDto: ReviewDto = {
  rating: 4,
  user: '',
  vote_affirmative: 0,
  vote_negative: 0,
};

export const mockProductSimple = {
  _id: productId,
  name: 'Sample Product',
};

export const mockUsers = [
  {
    id: 'user1',
    first_name: 'John',
    last_name: 'Doe',
    nickname: 'johnny',
    profile_photo: 'photo1.jpg',
  },
  {
    id: 'user2',
    first_name: 'Jane',
    last_name: 'Smith',
    nickname: 'jsmith',
    profile_photo: 'photo2.jpg',
  },
];

export const mockProduct = {
  _id: 'productId',
  name: 'Product Name',
  description: 'Description',
  price: 100,
  category_id: new Types.ObjectId(),
  stock: 10,
  images: [],
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
  owner: new Types.ObjectId(),
  currency: 'USD' as const,
  score: 4.5,
  reviews: [
    {
      user: 'Eiu',
      created_at: new Date('12-03-2024'),
      rating: 3,
      vote_affirmative: 12,
      vote_negative: 5,
      comment: '',
    },
    {
      user: 'Aio',
      created_at: new Date('20-03-2024'),
      rating: 5,
      vote_affirmative: 10,
      vote_negative: 2,
      comment: '',
    },
  ],
};

export const mockUpdatedProduct = {
  ...mockProduct,
  reviews: [...mockProduct.reviews],
};

export const mockUser = {
  _id: 'user1',
  first_name: 'John',
  last_name: 'Doe',
  nickname: 'jdoe',
  profile_photo: 'url.jpg',
};

export const mockProductService = {
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
};

export const mockUserService = {
  findById: jest.fn(),
};
