/** Express */
import { Request } from 'express';

export const mockRequest = {} as Request;

export const id = 'categoryId123';

export const mockCategoryDto = {
  name: 'New Category',
  description: '',
  is_active: true,
};

export const mockCategory = {
  _id: '60c72b2f9b1e8d001c8e4f3a',
  ...mockCategoryDto,
};
