/* eslint-disable @typescript-eslint/no-unsafe-argument */

/** Nest */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

/** Services */
import { UserService } from '../../src/modules/user/user.service';

/** Schemas */
import { User, UserDocument } from '../../src/modules/user/schema/user.schema';

/** DTO */
import { CompleteUserDto } from '../../src/modules/user/dto';

/** Class validator */
import { validateOrReject } from 'class-validator';

/** Mongoose */
import { Model } from 'mongoose';

/** bcrypt */
import { hash, compare } from 'bcrypt';

/** jsonwebtoken */
import { sign } from 'jsonwebtoken';

/** Mocks */
import {
  userDto,
  invalidUserDto,
  mockRequest,
  mailExample,
  userId,
  invalidUserId,
  mockDesactiveUser,
  mockUserPartial,
} from './user.mock';

jest.mock(
  'class-validator',
  (): Record<string, unknown> => ({
    ...jest.requireActual('class-validator'),
    validateOrReject: jest.fn(),
  }),
);

jest.mock(
  'bcrypt',
  () =>
    ({
      ...jest.requireActual('bcrypt'),
      hash: jest.fn(),
      compare: jest.fn(),
    }) as unknown as Record<string, unknown>,
);

jest.mock(
  'jsonwebtoken',
  () =>
    ({
      ...jest.requireActual('jsonwebtoken'),
      sign: jest.fn(),
    }) as unknown as Record<string, unknown>,
);

describe('UserService', () => {
  let service: UserService;
  let userModelMock: Partial<Model<User>>;

  beforeEach(async () => {
    userModelMock = {
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserModel', useValue: userModelMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('validateMongoId', () => {
    it('should throw an error if ID is invalid', () => {
      expect(() => {
        service.validateMongoId(invalidUserId);
      }).toThrow(Error);

      expect(() => {
        service.validateMongoId(invalidUserId);
      }).toThrow(`Invalid ID: ${invalidUserId}`);
    });

    it('should return true if ID is valid', () => {
      const result = service.validateMongoId(userId);

      expect(result).toBe(true);
    });
  });

  describe('validateData', () => {
    it('should validate and return the instance if data is valid', async () => {
      expect(await service.validateData(mockRequest, userDto)).toBeInstanceOf(
        CompleteUserDto,
      );
      expect(await service.validateData(mockRequest, userDto)).toMatchObject(
        userDto,
      );
    });

    it('should throw HttpException if validation fails', async () => {
      (validateOrReject as jest.Mock).mockRejectedValue(
        new Error('validation failed'),
      );

      await expect(
        service.validateData(mockRequest, { last_name: '', email: '' }),
      ).rejects.toThrow(
        new HttpException(
          'Validation failed for user data',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      userModelMock = {
        save: jest.fn(),
      } as Partial<Model<User>>;

      const userModelConstructor = jest
        .fn()
        .mockImplementation((data: Partial<User>) => ({
          ...data,
          save: jest.fn().mockResolvedValue({ _id: 'fakeId', ...data }),
        })) as unknown as new (
        data: Partial<User>,
      ) => User & { save: () => Promise<any> };

      service = new UserService(userModelConstructor as any);
    });

    it('should create and return a user if data is valid', async () => {
      (hash as jest.Mock).mockResolvedValue('hashedPassword123');

      expect(
        await service.createUser(mockRequest, {
          ...userDto,
          password: 'plaintextpass',
        }),
      ).toMatchObject({
        _id: 'fakeId',
        ...userDto,
        password: 'hashedPassword123',
      });
      expect(hash).toHaveBeenCalledWith('plaintextpass', 10);
    });

    it('should throw HttpException if user creation fails', async () => {
      (hash as jest.Mock).mockResolvedValue('hashedPassword123');

      const userModelConstructor = jest.fn().mockImplementation(() => ({
        ...invalidUserDto,
        save: jest.fn().mockRejectedValue(new Error('DB Error')),
      }));

      service = new UserService(userModelConstructor as any);

      await expect(
        service.createUser(mockRequest, invalidUserDto),
      ).rejects.toThrow(
        new HttpException(
          'User creation failed due to invalid data or server error.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user if found by email', async () => {
      (userModelMock.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserPartial),
      });

      await expect(
        service.findByEmail(mockRequest, {
          email: 'john@example.com',
        }),
      ).resolves.toEqual(mockUserPartial);
    });

    it('should throw NotFoundException if user is not found', async () => {
      (userModelMock.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      await expect(
        service.findByEmail(mockRequest, mailExample),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException 500 if other error occurs', async () => {
      (userModelMock.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database failure')),
      });

      await expect(
        service.findByEmail(mockRequest, mailExample),
      ).rejects.toThrow(
        new HttpException(
          'An error occurred while retrieving user data.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('validateUserCredentials', () => {
    it('should return a token if credentials are valid', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue({
        ...mockUserPartial,
        password: 'hashedPass',
      } as unknown as UserDocument);
      (compare as jest.Mock).mockResolvedValue(true);
      (sign as jest.Mock).mockReturnValue('mocked.jwt.token');

      expect(
        await service.validateUserCredentials(mockRequest, {
          email: mockUserPartial.email,
          password: 'plaintextPass',
        }),
      ).toEqual({ token: 'Bearer mocked.jwt.token' });
      expect(compare).toHaveBeenCalledWith('plaintextPass', 'hashedPass');
      expect(sign).toHaveBeenCalledWith(
        { id: mockUserPartial._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '60m',
        },
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue({
        ...mockUserPartial,
        password: 'hashedPass',
      } as unknown as UserDocument);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUserCredentials(mockRequest, {
          email: mockUserPartial.email,
          password: 'wrongPass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should rethrow HttpException if findByEmail throws one', async () => {
      jest
        .spyOn(service, 'findByEmail')
        .mockRejectedValue(
          new HttpException('User not found', HttpStatus.NOT_FOUND),
        );

      await expect(
        service.validateUserCredentials(mockRequest, {
          email: '',
          password: '',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw generic HttpException on unexpected errors', async () => {
      jest
        .spyOn(service, 'findByEmail')
        .mockRejectedValue(new Error('DB Error'));

      await expect(
        service.validateUserCredentials(mockRequest, {
          email: 'crash@example.com',
          password: 'irrelevant',
        }),
      ).rejects.toThrow(
        new HttpException(
          'An unexpected error occurred during login.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findById', () => {
    beforeEach(() => {
      jest.spyOn(service, 'validateMongoId').mockReturnValue(true);
    });

    it('should return the user if found', async () => {
      (userModelMock.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserPartial),
      });

      expect(await service.findById(mockRequest, userId)).toEqual(
        mockUserPartial,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      (userModelMock.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(mockRequest, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException if validateMongoId fails', async () => {
      (service.validateMongoId as jest.Mock).mockImplementation(() => {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      });

      await expect(
        service.findById(mockRequest, invalidUserId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException 500 if an unexpected error occurs', async () => {
      (userModelMock.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('DB crashed')),
      });

      await expect(service.findById(mockRequest, userId)).rejects.toThrow(
        new HttpException(
          'An error occurred while retrieving user by ID.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateUser', () => {
    beforeEach(() => {
      jest.spyOn(service, 'validateMongoId').mockReturnValue(true);
      jest.spyOn(service, 'validateData').mockResolvedValue(userDto);
    });

    it('should update and return the user if data is valid', async () => {
      (userModelMock.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockUserPartial,
          first_name: 'Updated',
        }),
      });

      expect(await service.updateUser(mockRequest, userId, userDto)).toEqual({
        ...mockUserPartial,
        first_name: 'Updated',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      (userModelMock.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateUser(mockRequest, userId, userDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException if validateData fails', async () => {
      (service.validateData as jest.Mock).mockRejectedValue(
        new HttpException('Invalid data', HttpStatus.FORBIDDEN),
      );

      await expect(
        service.updateUser(mockRequest, userId, userDto),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException 500 if an unexpected error occurs', async () => {
      (userModelMock.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('DB crash')),
      });

      await expect(
        service.updateUser(mockRequest, userId, userDto),
      ).rejects.toThrow(
        new HttpException(
          'An error occurred while updating user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('softDeleteUser', () => {
    beforeEach(() => {
      jest.spyOn(service, 'validateMongoId').mockReturnValue(true);
    });

    it('should deactivate and return the user', async () => {
      (userModelMock.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDesactiveUser),
      });

      expect(await service.softDeleteUser(mockRequest, userId)).toEqual(
        mockDesactiveUser,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      (userModelMock.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.softDeleteUser(mockRequest, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException if validateMongoId fails', async () => {
      (service.validateMongoId as jest.Mock).mockImplementation(() => {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      });

      await expect(
        service.softDeleteUser(mockRequest, invalidUserId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException 500 on unexpected errors', async () => {
      (userModelMock.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('DB exploded')),
      });

      await expect(service.softDeleteUser(mockRequest, userId)).rejects.toThrow(
        new HttpException(
          'An error occurred while trying to deactivate the user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      jest.spyOn(service, 'validateMongoId').mockReturnValue(true);
    });

    it('should delete user and return confirmation message', async () => {
      (userModelMock.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserPartial),
      });

      const result = await service.deleteUser(mockRequest, userId);

      expect(result).toEqual({
        message: `User ${userId} deleted successfully`,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (userModelMock.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deleteUser(mockRequest, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException if validateMongoId fails', async () => {
      (service.validateMongoId as jest.Mock).mockImplementation(() => {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      });

      await expect(
        service.deleteUser(mockRequest, invalidUserId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException 500 if unexpected error occurs', async () => {
      (userModelMock.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('DB fail')),
      });

      await expect(service.deleteUser(mockRequest, userId)).rejects.toThrow(
        new HttpException(
          'An error occurred while trying to delete the user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
