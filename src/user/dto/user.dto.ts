/** Swagger */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Class transformer */
import { Type } from 'class-transformer';

/** DTO */
import { Address } from '../dto/address.dto';
import { CartItem } from '../dto/cart-item.dto';
import { Preferencies } from './preferencies.dto';
import { SocialNetwork } from '../dto/social-network.dto';

/** Validators */
import {
  IsArray,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  GUEST = 'guest',
}

export enum UserGender {
  FEMALE = 'Female',
  MALE = 'Male',
  OTHER = 'Other',
}

export enum ThemePreference {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum LanguagePreference {
  EN = 'en',
  ES = 'es',
  IT = 'it',
  PT = 'pt',
}

export class UserDto {
  @ApiProperty({ example: 'John', maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  first_name: string;

  @ApiProperty({ example: 'Doe', maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  last_name: string;

  @ApiProperty({ example: 'johnny', maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nickname: string;

  @ApiProperty({ example: '1995-11-07' })
  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123', minLength: 8, maxLength: 24 })
  @MinLength(8)
  @MaxLength(24)
  password: string;

  @ApiProperty({ enum: UserGender, default: UserGender.OTHER })
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;
}

export class CompleteUserDto extends UserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profile_photo?: string;

  @ApiProperty({
    description: 'Mongo ID of the address',
    example: '60c72b2f9b1e8d001c8e4f3a',
  })
  @ApiPropertyOptional()
  @ValidateNested()
  @IsOptional()
  @IsMongoId()
  @Type(() => Address)
  address?: Address;

  @ApiProperty({
    description: 'Mongo ID of the preferences',
    example: '60c72b2f9b1e8d001c8e4f3a',
  })
  @ApiPropertyOptional()
  @ValidateNested()
  @IsOptional()
  @IsMongoId()
  @Type(() => Preferencies)
  preferencies?: Preferencies;

  @ApiProperty({
    description: 'Mongo ID of the social network',
    example: '60c72b2f9b1e8d001c8e4f3a',
  })
  @ApiPropertyOptional()
  @ValidateNested()
  @IsOptional()
  @IsMongoId()
  @Type(() => SocialNetwork)
  social_network?: SocialNetwork;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  user_state?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    description: 'User wishlist of product IDs',
    example: ['product01', 'product02', 'product03'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  wishlist?: string[];

  @ApiProperty({
    description: 'User cart items',
    example: [
      { productId: 'product03', quantity: 10 },
      { productId: 'product01', quantity: 2 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  cart?: CartItem[];
}

export type PasswordUserDto = Pick<UserDto, 'password'>;

export type RoleUserDto = Pick<UserDto, 'role'>;

export type NicknameUserDto = Pick<UserDto, 'nickname'>;

export type LoginUserDto = Pick<UserDto, 'email' | 'password'>;

export type EmailUserDto = Pick<UserDto, 'email'>;
