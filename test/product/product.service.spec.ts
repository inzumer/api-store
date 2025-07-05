/** Nest */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, HttpException } from '@nestjs/common';

/** Services */
import { Product } from '../../src/modules/product/schema/product.schema';
import { Category } from '../../src/modules/category/schema/category.schema';
import { ProductService } from '../../src/modules/product/product.service';

/** Mongoose */
import { getModelToken } from '@nestjs/mongoose';

/** Mocks */
import {
  mockRequest,
  productId,
  invalidId,
  mockProductDto,
  mockProductInstance,
  mockProduct,
  mockUpdatedProduct,
  mockSoftDeletedProduct,
} from './product.mock';

describe('ProductService', () => {
  let service: ProductService;

  const mockProductModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockCategoryModel = {
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getModelToken(Product.name), useValue: mockProductModel },
        { provide: getModelToken(Category.name), useValue: mockCategoryModel },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createProduct', () => {
    it('should create and save a product', async () => {
      mockCategoryModel.exists.mockResolvedValue(true);

      (service as any).productModel = jest.fn(() => mockProductInstance);

      const result = await service.createProduct(mockRequest, mockProductDto);

      expect(result).toEqual({ _id: productId, ...mockProductDto });
      expect(mockProductInstance.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryModel.exists.mockResolvedValue(false);

      await expect(
        service.createProduct(mockRequest, mockProductDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException on unknown error', async () => {
      mockCategoryModel.exists.mockRejectedValue(new Error('boom'));

      await expect(
        service.createProduct(mockRequest, mockProductDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.getProductById(mockRequest, productId);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException for invalid or not found ID', async () => {
      await expect(
        service.getProductById(mockRequest, invalidId),
      ).rejects.toThrow(NotFoundException);

      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.getProductById(mockRequest, productId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException on generic error', async () => {
      mockProductModel.findById.mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(
        service.getProductById(mockRequest, productId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateProduct', () => {
    it('should update and return product', async () => {
      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedProduct),
      });

      const result = await service.updateProduct(mockRequest, productId, {
        name: 'updated',
      });
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should throw NotFoundException for invalid or not found ID', async () => {
      await expect(
        service.updateProduct(mockRequest, invalidId, {}),
      ).rejects.toThrow(NotFoundException);

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateProduct(mockRequest, productId, {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException on generic error', async () => {
      mockProductModel.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(
        service.updateProduct(mockRequest, productId, {}),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('softDeleteProduct', () => {
    it('should soft delete a product', async () => {
      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSoftDeletedProduct),
      });

      const result = await service.softDeleteProduct(mockRequest, productId);
      expect(result).toEqual(mockSoftDeletedProduct);
    });

    it('should throw NotFoundException for invalid or not found ID', async () => {
      await expect(
        service.softDeleteProduct(mockRequest, invalidId),
      ).rejects.toThrow(NotFoundException);

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.softDeleteProduct(mockRequest, productId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException on generic error', async () => {
      mockProductModel.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(
        service.softDeleteProduct(mockRequest, productId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return success message', async () => {
      mockProductModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.deleteProduct(mockRequest, productId);
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(
        service.deleteProduct(mockRequest, invalidId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException on generic error', async () => {
      mockProductModel.findByIdAndDelete.mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(
        service.deleteProduct(mockRequest, productId),
      ).rejects.toThrow(HttpException);
    });
  });
});
