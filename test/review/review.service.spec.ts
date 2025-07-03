import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from '../../src/review/review.service';
import { UserService } from '../../src/user/user.service';
import { ProductService } from '../../src/product/product.service';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: UserService, useValue: {} },
        { provide: ProductService, useValue: {} },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
