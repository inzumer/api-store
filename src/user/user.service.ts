/** Nest */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

/** DTO */
import {
  UserDto,
  EmailUserDto,
  LoginUserDto,
  CompleteUserDto,
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

/** Resources bcrypt */
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Validates a MongoDB ID.
   * @param id - The ID to validate.
   * @returns True if the ID is valid, otherwise throws an error.
   * @throws Error if the ID is invalid.
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
   * @param data - The data to validate and transform.
   * @returns A CompleteUserDto instance if validation is successful.
   * @throws BadRequestException if validation fails.
   */
  async validateData(data: Partial<CompleteUserDto>): Promise<CompleteUserDto> {
    try {
      const instance = plainToInstance(CompleteUserDto, data);

      await validateOrReject(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      });

      return instance;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Creates a new user.
   * @param data - The user data to create.
   * @returns The created user object.
   */
  async createUser(data: UserDto): Promise<User> {
    try {
      const hashGenerate = (await hash(data.password, 10)) as string;

      const createdUser = new this.userModel({
        ...data,
        password: hashGenerate,
      });

      return await createdUser.save();
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Finds a user by email.
   * @param email - The email to search for.
   * @returns The user with the specified email.
   */
  async findByEmail({ email }: EmailUserDto): Promise<User> {
    try {
      const userFind = await this.userModel.findOne({ email }).exec();

      if (!userFind) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return userFind as User;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Validates user credentials.
   * @param data - The user credentials to validate.
   * @returns The user if credentials are valid.
   * @throws BadRequestException if the password is invalid or user not found.
   */
  async validateUserCredentials(data: LoginUserDto): Promise<User> {
    try {
      const { email, password } = data;

      const user = await this.findByEmail({ email });

      const isValid = (await compare(password, user?.password)) as boolean;

      if (!isValid) {
        throw new BadRequestException('Invalid password');
      }

      return isValid && user;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Finds a user by ID.
   * @param userId - The ID of the user to find.
   * @returns The user with the specified ID.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the user is not found.
   */
  async findById(userId: string): Promise<User> {
    try {
      this.validateMongoId(userId);

      const result = await this.userModel.findById(userId).exec();

      return result as User;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Updates an existing user with partial data.
   * @param userId - The ID of the user to update.
   * @param data - Partial data to update the user.
   * @returns The updated user.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the user does not exist.
   */
  async updateUser(
    userId: string,
    data: Partial<CompleteUserDto>,
  ): Promise<User> {
    try {
      this.validateMongoId(userId);

      const validatedData = await this.validateData(data);

      let result;

      if (validatedData) {
        result = await this.userModel
          .findByIdAndUpdate(userId, data, {
            new: true,
          })
          .exec();
      }

      return result as User;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Soft deletes a user by setting is_active to false.
   * @param userId - The ID of the user to soft delete.
   * @returns The updated user with is_active set to false.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the user is not found.
   */
  async softDeleteUser(userId: string): Promise<User> {
    try {
      this.validateMongoId(userId);

      const result = await this.userModel
        .findByIdAndUpdate(userId, { is_active: false }, { new: true })
        .exec();

      return result as User;
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }

  /**
   * Deletes a user by ID.
   * @param userId - The ID of the user to delete.
   * @returns A message indicating successful deletion.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the user does not exist.
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      this.validateMongoId(userId);

      await this.userModel.findByIdAndDelete(userId).exec();

      return {
        message: `User ${userId} deleted successfully`,
      };
    } catch (errors) {
      throw new BadRequestException(`${errors}`);
    }
  }
}
