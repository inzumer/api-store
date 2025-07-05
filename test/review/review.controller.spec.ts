/** Nest */
import { Test, TestingModule } from '@nestjs/testing';

/** Review dependencies  */
import { ReviewController } from '../../src/modules/review/review.controller';
import { ReviewService } from '../../src/modules/review/review.service';

/** Mocks */
import {
  req,
  productId,
  userId,
  reviewDto,
  mockProductSimple,
  mockUsers,
} from './review.mock';

describe('ReviewController', () => {
  let controller: ReviewController;

  const mockReviewService = {
    addReview: jest.fn(),
    removeReview: jest.fn(),
    getReviews: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [{ provide: ReviewService, useValue: mockReviewService }],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    jest.clearAllMocks();
  });

  describe('addReview', () => {
    it('should call reviewService.addReview with correct params and return result', async () => {
      mockReviewService.addReview.mockResolvedValue(mockProductSimple);

      const result = await controller.addReview(
        req,
        productId,
        reviewDto,
        userId,
      );

      expect(mockReviewService.addReview).toHaveBeenCalledWith(
        req,
        productId,
        userId,
        reviewDto,
      );
      expect(result).toBe(mockProductSimple);
    });
  });

  describe('removeReview', () => {
    it('should call reviewService.removeReview with correct params and return result', async () => {
      mockReviewService.removeReview.mockResolvedValue(mockProductSimple);

      const result = await controller.removeReview(req, productId, userId);

      expect(mockReviewService.removeReview).toHaveBeenCalledWith(
        req,
        productId,
        userId,
      );
      expect(result).toBe(mockProductSimple);
    });
  });

  describe('getProductReviewUsers', () => {
    it('should call reviewService.getReviews with correct productId and return result', async () => {
      mockReviewService.getReviews.mockResolvedValue(mockUsers);

      const result = await controller.getProductReviewUsers(req, productId);

      expect(mockReviewService.getReviews).toHaveBeenCalledWith(req, productId);
      expect(result).toBe(mockUsers);
    });
  });
});
