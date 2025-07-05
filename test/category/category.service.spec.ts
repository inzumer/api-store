/** Nest  */
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

/** Services */
import { CategoryService } from '../../src/modules/category/category.service';

/** Schema */
import { Category } from '../../src/modules/category/schema/category.schema';

/** Mongoose */
import { getModelToken } from '@nestjs/mongoose';

/** Mocks */
import { mockRequest, mockCategory, mockCategoryDto } from './category.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let model: Record<string, jest.Mock>;

  const baseMockModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: { ...baseMockModel },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    model = module.get(getModelToken(Category.name));
  });

  afterEach(() => jest.clearAllMocks());

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const saveMock = jest.fn().mockResolvedValue(mockCategory);

      const categoryInstance = { save: saveMock };
      const mockCategoryModel = Object.assign(
        jest.fn(() => categoryInstance),
        {
          findOne: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
          }),
        },
      );

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CategoryService,
          {
            provide: getModelToken(Category.name),
            useValue: mockCategoryModel,
          },
        ],
      }).compile();

      service = module.get<CategoryService>(CategoryService);
      model = module.get(getModelToken(Category.name));

      const result = await service.createCategory(mockRequest, mockCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(saveMock).toHaveBeenCalled();
      expect(model.findOne).toHaveBeenCalledWith({
        name: mockCategoryDto.name,
      });
    });

    it('should throw if category already exists', async () => {
      model.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      await expect(
        service.createCategory(mockRequest, mockCategoryDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle unexpected errors', async () => {
      model.findOne.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      await expect(
        service.createCategory(mockRequest, mockCategoryDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getCategoryById', () => {
    it('should return category if found', async () => {
      model.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.getCategoryById(
        mockRequest,
        mockCategory._id,
      );
      expect(result).toEqual(mockCategory);
    });

    it('should throw if invalid id', async () => {
      await expect(
        service.getCategoryById(mockRequest, 'invalid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if category not found', async () => {
      model.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.getCategoryById(mockRequest, mockCategory._id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw generic error', async () => {
      model.findById.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      await expect(
        service.getCategoryById(mockRequest, mockCategory._id),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getAllCategories', () => {
    it('should return all active categories', async () => {
      model.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue([mockCategory]),
      });

      const result = await service.getAllCategories(mockRequest);
      expect(result).toEqual([mockCategory]);
    });

    it('should throw on failure', async () => {
      model.find.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      await expect(service.getAllCategories(mockRequest)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateCategory', () => {
    it('should update category', async () => {
      model.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.updateCategory(
        mockRequest,
        mockCategory._id,
        {
          name: 'Updated',
        },
      );

      expect(result).toEqual(mockCategory);
    });

    it('should throw if invalid ID', async () => {
      await expect(
        service.updateCategory(mockRequest, 'invalid', { name: 'X' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if category not found', async () => {
      model.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateCategory(mockRequest, mockCategory._id, { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle unexpected error', async () => {
      model.findByIdAndUpdate.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      await expect(
        service.updateCategory(mockRequest, mockCategory._id, { name: 'X' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('softDeleteCategory', () => {
    it('should soft delete category', async () => {
      model.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.softDeleteCategory(
        mockRequest,
        mockCategory._id,
      );
      expect(result).toEqual(mockCategory);
    });

    it('should throw if invalid ID', async () => {
      await expect(
        service.softDeleteCategory(mockRequest, 'invalid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if category not found', async () => {
      model.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.softDeleteCategory(mockRequest, mockCategory._id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle unexpected error', async () => {
      model.findByIdAndUpdate.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      await expect(
        service.softDeleteCategory(mockRequest, mockCategory._id),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete category', async () => {
      model.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.deleteCategory(
        mockRequest,
        mockCategory._id,
      );
      expect(result).toEqual({ message: 'Category deleted successfully' });
    });

    it('should throw if invalid ID', async () => {
      await expect(
        service.deleteCategory(mockRequest, 'invalid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if not found', async () => {
      model.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.deleteCategory(mockRequest, mockCategory._id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw unexpected error', async () => {
      model.findByIdAndDelete.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      await expect(
        service.deleteCategory(mockRequest, mockCategory._id),
      ).rejects.toThrow(HttpException);
    });
  });
});
