/** Nest */
import { Test, TestingModule } from '@nestjs/testing';

/** Category dependencies  */
import { CategoryController } from '../../src/modules/category/category.controller';
import { CategoryService } from '../../src/modules/category/category.service';

/** Mocks */
import {
  id,
  mockRequest,
  mockCategoryDto,
  mockCategory,
} from './category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;

  const mockService = {
    createCategory: jest.fn().mockResolvedValue(mockCategory),
    getCategoryById: jest.fn().mockResolvedValue(mockCategory),
    getAllCategories: jest.fn().mockResolvedValue([mockCategory]),
    updateCategory: jest
      .fn()
      .mockImplementation(
        (
          _req: any,
          _id: any,
          updateData: Partial<typeof mockCategory>,
        ): typeof mockCategory => ({
          ...mockCategory,
          ...updateData,
        }),
      ),
    softDeleteCategory: jest.fn().mockImplementation(() => ({
      ...mockCategory,
      is_active: false,
    })),
    deleteCategory: jest
      .fn()
      .mockResolvedValue({ message: 'Category deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryService, useValue: mockService }],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);

    jest.clearAllMocks();
  });

  const expectServiceCalledWith = (
    methodName: keyof typeof mockService,
    args: unknown[],
  ) => {
    expect(mockService[methodName]).toHaveBeenCalledWith(...args);
  };

  describe('createCategory', () => {
    it('should create a category', async () => {
      const result = await controller.createCategory(
        mockRequest,
        mockCategoryDto,
      );
      expect(result).toEqual(mockCategory);
      expectServiceCalledWith('createCategory', [mockRequest, mockCategoryDto]);
    });
  });

  describe('getCategoryById', () => {
    it('should get category by id', async () => {
      const result = await controller.getCategoryById(mockRequest, id);
      expect(result).toEqual(mockCategory);
      expectServiceCalledWith('getCategoryById', [mockRequest, id]);
    });
  });

  describe('getAllCategories', () => {
    it('should get all categories', async () => {
      const result = await controller.getAllCategories(mockRequest);
      expect(result).toEqual([mockCategory]);
      expectServiceCalledWith('getAllCategories', [mockRequest]);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateData = { description: 'Updated description' };
      const result = await controller.updateCategory(
        mockRequest,
        id,
        updateData,
      );
      expect(result).toEqual({ ...mockCategory, ...updateData });
      expectServiceCalledWith('updateCategory', [mockRequest, id, updateData]);
    });
  });

  describe('softDeleteCategory', () => {
    it('should soft delete a category', async () => {
      const result = await controller.softDeleteCategory(mockRequest, id);
      expect(result).toEqual({ ...mockCategory, is_active: false });
      expectServiceCalledWith('softDeleteCategory', [mockRequest, id]);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const result = await controller.deleteCategory(mockRequest, id);
      expect(result).toEqual({ message: 'Category deleted successfully' });
      expectServiceCalledWith('deleteCategory', [mockRequest, id]);
    });
  });
});
