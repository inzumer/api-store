import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../../src/cart/cart.service';
import { UserService } from '../../src/user/user.service';
import { getModelToken } from '@nestjs/mongoose';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getModelToken('User'), useValue: {} },
        { provide: getModelToken('Product'), useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
