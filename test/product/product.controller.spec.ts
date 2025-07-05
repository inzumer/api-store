/** Nest */
import { Test, TestingModule } from '@nestjs/testing';

/** Product dependencies  */
import { ProductController } from '../../src/modules/product/product.controller';
import { ProductService } from '../../src/modules/product/product.service';

/** Mocks */
import {
  mockRequest,
  mockProductDto,
  mockPartialProduct,
  falseProductId,
} from './product.mock';

describe('ProductController', () => {
  let controller: ProductController;

  const mockPartialProductService = {
    createProduct: jest.fn(),
    getProductById: jest.fn(),
    deleteProduct: jest.fn(),
    softDeleteProduct: jest.fn(),
    updateProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockPartialProductService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      mockPartialProductService.createProduct.mockResolvedValue(
        mockPartialProduct,
      );

      const result = await controller.createProduct(
        mockRequest,
        mockProductDto,
      );

      expect(mockPartialProductService.createProduct).toHaveBeenCalledWith(
        mockRequest,
        mockProductDto,
      );
      expect(result).toEqual(mockPartialProduct);
    });
  });

  describe('gettById', () => {
    it('should return product by ID', async () => {
      mockPartialProductService.getProductById.mockResolvedValue(
        mockPartialProduct,
      );

      const result = await controller.gettById(mockRequest, falseProductId);

      expect(mockPartialProductService.getProductById).toHaveBeenCalledWith(
        mockRequest,
        falseProductId,
      );
      expect(result).toEqual(mockPartialProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should return success message', async () => {
      const response = { message: 'Product deleted successfully' };
      mockPartialProductService.deleteProduct.mockResolvedValue(response);

      const result = await controller.deleteProduct(
        mockRequest,
        falseProductId,
      );

      expect(mockPartialProductService.deleteProduct).toHaveBeenCalledWith(
        mockRequest,
        falseProductId,
      );
      expect(result).toEqual(response);
    });
  });

  describe('softDelete', () => {
    it('should soft delete product', async () => {
      mockPartialProductService.softDeleteProduct.mockResolvedValue(
        mockPartialProduct,
      );

      const result = await controller.softDelete(mockRequest, falseProductId);

      expect(mockPartialProductService.softDeleteProduct).toHaveBeenCalledWith(
        mockRequest,
        falseProductId,
      );
      expect(result).toEqual(mockPartialProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const updateData = {
        description: 'Updated desc',
        stock: 50,
      };

      mockPartialProductService.updateProduct.mockResolvedValue({
        ...mockPartialProduct,
        ...updateData,
      });

      const result = await controller.updateProduct(
        mockRequest,
        falseProductId,
        updateData,
      );

      expect(mockPartialProductService.updateProduct).toHaveBeenCalledWith(
        mockRequest,
        falseProductId,
        updateData,
      );
      expect(result).toEqual({ ...mockPartialProduct, ...updateData });
    });
  });
});
