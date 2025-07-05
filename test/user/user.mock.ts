/** DTO's */
import { UserGender, UserRole } from '../../src/modules/user/dto';

/** Express */
import { Request } from 'express';

/** Mongoose */
import { UserDocument } from '../../src/modules/user/schema/user.schema';

export const mockRequest = {} as Request;
export const mailExample = { email: 'any@example.com' };
export const userId = '507f1f77bcf86cd799439011';
export const invalidUserId = 'invalid-id';
export const deleteSuccessMessage = {
  message: `User ${userId} deleted successfully`,
};

export const userDto = {
  first_name: 'John',
  last_name: 'Doe',
  nickname: 'jdoe',
  birthday: new Date('12-06-1998'),
  email: 'john@example.com',
  password: 'plaintextpass',
  gender: UserGender.OTHER,
  role: UserRole.USER,
};

export const invalidUserDto = {
  first_name: '',
  last_name: '',
  nickname: '',
  birthday: new Date('12-06-1998'),
  email: '',
  password: '',
  gender: UserGender.OTHER,
  role: UserRole.USER,
};

export const fakeUser = {
  _id: userId,
  email: userDto.email,
  password: 'hashedPass',
  is_active: true,
} as unknown as UserDocument;

export const updatedUser = {
  ...fakeUser,
  first_name: 'Updated',
};

export const mockDesactiveUser = {
  _id: userId,
  email: userDto.email,
  is_active: false,
};

export const mockUserPartial = { _id: userId, email: userDto.email };
