/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/** Nest */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/** DTO */
import {
  UserDto,
  EmailUserDto,
  LoginUserDto,
  CompleteUserDto,
  UserToken,
} from './dto/user.dto';

/** Mongoose */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/** Class validator */
import { isMongoId, validateOrReject } from 'class-validator';

/** Class transform */
import { plainToInstance } from 'class-transformer';

/** Schemas */
import { User, UserDocument } from './schema/user.schema';

/** Express */
import { Request } from 'express';

/** Resources bcrypt */
import { hash, compare } from 'bcrypt';

/** Resources jsonwebtoken */
import { sign } from 'jsonwebtoken';

/** Logger */
import { LoggerService } from '../common/logger';

@Injectable()
export class UserService {
  logger = new LoggerService('UserService');

  constructor(
    @InjectModel(User.name)
    readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Validates a MongoDB ID.
   * @param id - The ID to validate.
   * @returns True if the ID is valid, otherwise throws an error.
   */
  validateMongoId(id: string): boolean {
    const isValid = isMongoId(id);

    if (!isValid) {
      throw new Error(`Invalid ID: ${id}`);
    }

    return isValid;
  }

  /**
   * Validates and transforms data into a CompleteUserDto instance.
   * @param req - The request object, used for logging.
   * @param data - The data to validate and transform.
   * @returns A CompleteUserDto instance if validation is successful.
   */
  async validateData(
    req: Request,
    data: Partial<CompleteUserDto>,
  ): Promise<CompleteUserDto> {
    try {
      const instance = plainToInstance(CompleteUserDto, data);

      await validateOrReject(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      });

      return instance;
    } catch (error) {
      this.logger.error(
        { request: req, error },
        'Validation failed for user data',
      );

      throw new HttpException(
        'Validation failed for user data',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Creates a new user.
   * @param req - The request object, used for logging.
   * @param data - The user data to create.
   * @returns The created user object.
   */
  async createUser(req: Request, data: UserDto): Promise<User> {
    try {
      const hashGenerate = (await hash(data.password, 10)) as string;

      const createdUser = new this.userModel({
        ...data,
        password: hashGenerate,
      });

      return await createdUser.save();
    } catch (error) {
      this.logger.error({ request: req, error }, 'User creation failed');

      throw new HttpException(
        'User creation failed due to invalid data or server error.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Finds a user by email.
   * @param req - The request object, used for logging.
   * @param email - The email to search for.
   * @returns The user with the specified email.
   */
  async findByEmail(
    req: Request,
    { email }: EmailUserDto,
  ): Promise<UserDocument> {
    try {
      const userFind = await this.userModel.findOne({ email }).exec();

      if (!userFind) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return userFind as UserDocument;
    } catch (error) {
      this.logger.error({ request: req, error }, 'User lookup failed');

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while retrieving user data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validates user credentials.
   * @param req - The request object, used for logging.
   * @param data - The user credentials to validate.
   * @returns an object whit a token.
   */
  async validateUserCredentials(
    req: Request,
    data: LoginUserDto,
  ): Promise<UserToken> {
    try {
      const { email, password } = data;

      const user = await this.findByEmail(req, { email });

      const isValid = (await compare(password, user?.password)) as boolean;

      if (!isValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = { id: user?._id };

      const secret = process.env.JWT_SECRET;

      const accessToken = sign(payload, secret, {
        expiresIn: '60m',
      });

      return { token: `Bearer ${accessToken}` };
    } catch (error) {
      this.logger.error(
        { request: req, error },
        'User credential validation failed',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred during login.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Finds a user by ID.
   * @param req - The request object, used for logging.
   * @param userId - The ID of the user to find.
   * @returns The user with the specified ID.
   */
  async findById(req: Request, userId: string): Promise<User> {
    try {
      this.validateMongoId(userId);

      const result = await this.userModel.findById(userId).exec();

      if (!result) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return result as User;
    } catch (error) {
      this.logger.error({ request: req, error }, 'User lookup by ID failed');

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while retrieving user by ID.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates an existing user with partial data.
   * @param req - The request object, used for logging.
   * @param userId - The ID of the user to update.
   * @param data - Partial data to update the user.
   * @returns The updated user.
   */
  async updateUser(
    req: Request,
    userId: string,
    data: Partial<CompleteUserDto>,
  ): Promise<User> {
    try {
      this.validateMongoId(userId);

      const validatedData = await this.validateData(req, data);

      let result;

      if (validatedData) {
        result = await this.userModel
          .findByIdAndUpdate(userId, data, {
            new: true,
          })
          .exec();
      }

      if (!result) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return result as User;
    } catch (error) {
      this.logger.error({ request: req, error }, 'User update failed');

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while updating user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Soft deletes a user by setting is_active to false.
   * @param req - The request object, used for logging.
   * @param userId - The ID of the user to soft delete.
   * @returns The updated user with is_active set to false.
   */
  async softDeleteUser(req: Request, userId: string): Promise<User> {
    try {
      this.validateMongoId(userId);

      const result = await this.userModel
        .findByIdAndUpdate(userId, { is_active: false }, { new: true })
        .exec();

      if (!result) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return result as User;
    } catch (error) {
      this.logger.error({ request: req, error }, 'User soft delete failed');

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while trying to deactivate the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Deletes a user by ID.
   * @param req - The request object, used for logging.
   * @param userId - The ID of the user to delete.
   * @returns A message indicating successful deletion.
   */
  async deleteUser(req: Request, userId: string): Promise<{ message: string }> {
    try {
      this.validateMongoId(userId);

      const result = await this.userModel.findByIdAndDelete(userId).exec();

      if (!result) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return {
        message: `User ${userId} deleted successfully`,
      };
    } catch (error) {
      this.logger.error({ request: req, error }, 'User deletion failed');

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while trying to delete the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
