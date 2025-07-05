/** Nest */
import { Test, TestingModule } from '@nestjs/testing';

/** User dependencies */
import { UserController } from '../../src/modules/user/user.controller';
import { UserService } from '../../src/modules/user/user.service';

/** Mocks */
import {
  mockRequest,
  userDto,
  fakeUser,
  updatedUser,
  mockDesactiveUser,
  deleteSuccessMessage,
  userId,
} from './user.mock';

describe('UserController', () => {
  const mockService = {
    createUser: jest.fn(),
    validateUserCredentials: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    softDeleteUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      mockService.createUser.mockResolvedValue(fakeUser);
      const dto = { ...userDto, password: '123456' };
      const result = await controller.create(mockRequest, dto);
      expect(mockService.createUser).toHaveBeenCalledWith(mockRequest, dto);
      expect(result).toEqual(fakeUser);
    });
  });

  describe('loginUser', () => {
    it('should login user and return token', async () => {
      const credentials = { email: userDto.email, password: '123456' };
      const token = { token: 'Bearer token' };
      mockService.validateUserCredentials.mockResolvedValue(token);
      const result = await controller.login(mockRequest, credentials);
      expect(mockService.validateUserCredentials).toHaveBeenCalledWith(
        mockRequest,
        credentials,
      );
      expect(result).toEqual(token);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockService.findByEmail.mockResolvedValue(fakeUser);
      const result = await controller.findByEmail(mockRequest, {
        email: userDto.email,
      });
      expect(mockService.findByEmail).toHaveBeenCalledWith(mockRequest, {
        email: userDto.email,
      });
      expect(result).toEqual(fakeUser);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockService.findById.mockResolvedValue(fakeUser);
      const result = await controller.findById(mockRequest, userId);
      expect(mockService.findById).toHaveBeenCalledWith(mockRequest, userId);
      expect(result).toEqual(fakeUser);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      mockService.updateUser.mockResolvedValue(updatedUser);
      const result = await controller.updateUser(mockRequest, userId, userDto);
      expect(mockService.updateUser).toHaveBeenCalledWith(
        mockRequest,
        userId,
        userDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('softDeleteUser', () => {
    it('should soft delete user', async () => {
      mockService.softDeleteUser.mockResolvedValue(mockDesactiveUser);
      const result = await controller.softDelete(mockRequest, userId);
      expect(mockService.softDeleteUser).toHaveBeenCalledWith(
        mockRequest,
        userId,
      );
      expect(result).toEqual(mockDesactiveUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      mockService.deleteUser.mockResolvedValue(deleteSuccessMessage);
      const result = await controller.deleteProduct(mockRequest, userId);
      expect(mockService.deleteUser).toHaveBeenCalledWith(mockRequest, userId);
      expect(result).toEqual(deleteSuccessMessage);
    });
  });
});
