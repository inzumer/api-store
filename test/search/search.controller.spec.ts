/** Nest */
import { Test, TestingModule } from '@nestjs/testing';

/** Search dependencies */
import { SearchController } from '../../src/modules/search/search.controller';
import { SearchService } from '../../src/modules/search/search.service';

/** Mocks */
import { mockRequest, validId, mockProducts } from './search.mock';

describe('SearchController', () => {
  let controller: SearchController;

  const mockSearchService = {
    findByName: jest.fn(),
    getProductsByCategory: jest.fn(),
    findByOwner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByName', () => {
    it('should return products matching the name', async () => {
      const name = 'TestProduct';
      mockSearchService.findByName.mockResolvedValue(mockProducts);

      const result = await controller.getByName(mockRequest, name);

      expect(result).toEqual(mockProducts);
      expect(mockSearchService.findByName).toHaveBeenCalledWith(
        mockRequest,
        name,
      );
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category ID', async () => {
      mockSearchService.getProductsByCategory.mockResolvedValue(mockProducts);

      const result = await controller.getProductsByCategory(
        mockRequest,
        validId,
      );

      expect(result).toEqual(mockProducts);
      expect(mockSearchService.getProductsByCategory).toHaveBeenCalledWith(
        mockRequest,
        validId,
      );
    });
  });

  describe('getProductsByOwner', () => {
    it('should return products by owner ID', async () => {
      mockSearchService.findByOwner.mockResolvedValue(mockProducts);

      const result = await controller.getProductsByOwner(mockRequest, validId);

      expect(result).toEqual(mockProducts);
      expect(mockSearchService.findByOwner).toHaveBeenCalledWith(
        mockRequest,
        validId,
      );
    });
  });
});
