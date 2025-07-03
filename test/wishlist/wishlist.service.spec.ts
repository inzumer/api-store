import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from '../../src/wishlist/wishlist.service';

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: 'ProductModel', useValue: {} },
        { provide: 'UserModel', useValue: {} },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
