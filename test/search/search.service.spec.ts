/** Nest */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

/** Schemas */
import { Product } from '../../src/modules/product/schema';
import { Category } from '../../src/modules/category/schema';

/** Mongoose */
import { getModelToken } from '@nestjs/mongoose';

/** Services */
import { SearchService } from '../../src/modules/search/search.service';

/** Mocks */
import {
  mockRequest,
  mockProducts,
  mockProductModel,
  mockCategoryModel,
  validId,
  invalidId,
} from './search.mock';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByName', () => {
    it('should return products matching the name', async () => {
      mockProductModel.exec.mockResolvedValue(mockProducts);

      const result = await service.findByName(mockRequest, 'Test');
      expect(mockProductModel.find).toHaveBeenCalledWith({
        name: { $regex: 'Test', $options: 'i' },
      });
      expect(result).toEqual(mockProducts);
    });

    it('should throw NotFoundException if no products found', async () => {
      mockProductModel.exec.mockResolvedValue([]);

      await expect(service.findByName(mockRequest, 'NoMatch')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should rethrow HttpException if thrown inside try', async () => {
      const error = new HttpException('Error', 500);
      mockProductModel.exec.mockRejectedValue(error);

      await expect(service.findByName(mockRequest, 'Fail')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw generic HttpException if unknown error occurs (findByName)', async () => {
      mockProductModel.exec.mockRejectedValue(new Error('Unexpected failure'));

      await expect(
        service.findByName(mockRequest, 'anything'),
      ).rejects.toThrowError(
        new HttpException(
          'An error occurred while retrieving product data.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products if category exists and is valid', async () => {
      mockCategoryModel.exists.mockResolvedValue(true);
      mockProductModel.exec.mockResolvedValue(mockProducts);

      const result = await service.getProductsByCategory(mockRequest, validId);

      expect(mockCategoryModel.exists).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should throw NotFoundException for invalid category ID', async () => {
      await expect(
        service.getProductsByCategory(mockRequest, invalidId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockCategoryModel.exists.mockResolvedValue(false);

      await expect(
        service.getProductsByCategory(mockRequest, validId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rethrow HttpException if thrown inside try', async () => {
      const error = new HttpException('Internal fail', 500);
      mockCategoryModel.exists.mockRejectedValue(error);

      await expect(
        service.getProductsByCategory(mockRequest, validId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw generic HttpException if unknown error occurs (getProductsByCategory)', async () => {
      mockCategoryModel.exists.mockResolvedValue(true);
      mockProductModel.exec.mockRejectedValue(new Error('DB Error'));

      await expect(
        service.getProductsByCategory(mockRequest, validId),
      ).rejects.toThrowError(
        new HttpException(
          'An error occurred while retrieving product data.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findByOwner', () => {
    it('should return products for a valid owner ID', async () => {
      mockProductModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockProducts),
      });

      const result = await service.findByOwner(mockRequest, validId);

      expect(result).toEqual(mockProducts);
    });

    it('should throw NotFoundException for invalid owner ID', async () => {
      await expect(service.findByOwner(mockRequest, invalidId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should rethrow HttpException if thrown inside try', async () => {
      const error = new HttpException('Boom', 500);

      mockProductModel.find.mockImplementationOnce(() => {
        throw error;
      });

      await expect(service.findByOwner(mockRequest, validId)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw generic HttpException if a non-HttpException error occurs (findByOwner)', async () => {
      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockImplementation(() => {
          throw new Error('simulated unexpected error');
        }),
      });

      await expect(
        service.findByOwner(mockRequest, validId),
      ).rejects.toThrowError(
        new HttpException(
          'An error occurred while retrieving product data.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
