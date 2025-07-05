/** Nest */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

/** Services */
import { ReviewService } from '../../src/modules/review/review.service';
import { ProductService } from '../../src/modules/product/product.service';
import { UserService } from '../../src/modules/user/user.service';

/** Mocks */
import {
  mockProduct,
  mockUpdatedProduct,
  mockUser,
  req,
  mockProductService,
  mockUserService,
} from './review.mock';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: ProductService, useValue: mockProductService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get(ReviewService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('calculateAverageRating', () => {
    it('should calculate and update the average score', async () => {
      mockProductService.getProductById.mockResolvedValue(mockProduct);
      mockProductService.updateProduct.mockResolvedValue(mockUpdatedProduct);

      const result = await service.calculateAverageRating(req, 'productId');
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should rethrow known HttpException', async () => {
      const error = new HttpException('known error', 400);
      mockProductService.getProductById.mockRejectedValue(error);

      await expect(service.calculateAverageRating(req, '123')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw generic HttpException on unknown error', async () => {
      mockProductService.getProductById.mockRejectedValue(new Error('boom'));

      await expect(service.calculateAverageRating(req, '123')).rejects.toThrow(
        'An unexpected error occurred while calculating average rating.',
      );
    });
  });

  describe('addReview', () => {
    it('should throw ConflictException if user already reviewed', async () => {
      mockProductService.getProductById.mockResolvedValue({
        ...mockProduct,
        reviews: [{ user: 'user123', rating: 4 }],
      });

      await expect(
        service.addReview(req, 'productId', 'user123', {
          rating: 4,
          user: '',
          vote_affirmative: 0,
          vote_negative: 0,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should add a review and calculate score', async () => {
      mockProductService.getProductById.mockResolvedValue({
        ...mockProduct,
        reviews: [],
      });
      mockProductService.updateProduct.mockResolvedValue(mockUpdatedProduct);
      jest
        .spyOn(service, 'calculateAverageRating')
        .mockResolvedValue(mockUpdatedProduct);

      const result = await service.addReview(req, 'productId', 'user123', {
        rating: 4,
        user: '',
        vote_affirmative: 0,
        vote_negative: 0,
      });

      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should rethrow HttpException from getProductById', async () => {
      const error = new HttpException('fail', 403);
      mockProductService.getProductById.mockRejectedValue(error);

      await expect(
        service.addReview(req, 'prod123', 'user123', {
          rating: 4,
          user: '',
          vote_affirmative: 0,
          vote_negative: 0,
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw generic HttpException on unknown error', async () => {
      mockProductService.getProductById.mockRejectedValue(new Error('boom'));

      await expect(
        service.addReview(req, 'prod123', 'user123', {
          rating: 4,
          user: '',
          vote_affirmative: 0,
          vote_negative: 0,
        }),
      ).rejects.toThrow(
        'An unexpected error occurred while adding the review.',
      );
    });
  });

  describe('removeReview', () => {
    it('should remove a user review and update', async () => {
      mockProductService.getProductById.mockResolvedValue({
        ...mockProduct,
        reviews: [
          { user: 'userToDelete', rating: 4 },
          { user: 'keepUser', rating: 3 },
        ],
      });
      mockProductService.updateProduct.mockResolvedValue(mockUpdatedProduct);
      jest
        .spyOn(service, 'calculateAverageRating')
        .mockResolvedValue(mockUpdatedProduct);

      const result = await service.removeReview(
        req,
        'productId',
        'userToDelete',
      );
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should throw NotFoundException if review is not found', async () => {
      mockProductService.getProductById.mockResolvedValue({
        reviews: [{ user: 'user789', rating: 4, comment: 'Ok' }],
      });

      await expect(
        service.removeReview(req, 'product123', 'user456'),
      ).rejects.toThrowError(
        new NotFoundException(
          `No review found from user "user456" for this product`,
        ),
      );
    });

    it('should rethrow HttpException from getProductById', async () => {
      const error = new HttpException('fail', 403);
      mockProductService.getProductById.mockRejectedValue(error);

      await expect(
        service.removeReview(req, 'prod123', 'user123'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw generic HttpException on unknown error', async () => {
      mockProductService.getProductById.mockRejectedValue(new Error('boom'));

      await expect(
        service.removeReview(req, 'prod123', 'user123'),
      ).rejects.toThrow(
        'An unexpected error occurred while removing the review.',
      );
    });
  });

  describe('getReviews', () => {
    it('should return all user details of reviews', async () => {
      mockProductService.getProductById.mockResolvedValue({
        reviews: [{ user: 'user1' }, { user: 'user2' }],
      });

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await service.getReviews(req, 'productId');
      expect(result).toEqual([
        {
          id: 'user1',
          first_name: 'John',
          last_name: 'Doe',
          nickname: 'jdoe',
          profile_photo: 'url.jpg',
        },
        {
          id: 'user2',
          first_name: 'John',
          last_name: 'Doe',
          nickname: 'jdoe',
          profile_photo: 'url.jpg',
        },
      ]);
    });

    it('should rethrow HttpException from getProductById', async () => {
      const error = new HttpException('fail', 403);
      mockProductService.getProductById.mockRejectedValue(error);

      await expect(service.getReviews(req, 'prod123')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw generic HttpException on unknown error', async () => {
      mockProductService.getProductById.mockRejectedValue(new Error('boom'));

      await expect(service.getReviews(req, 'prod123')).rejects.toThrow(
        'An unexpected error occurred while retrieving reviews.',
      );
    });
  });
});
