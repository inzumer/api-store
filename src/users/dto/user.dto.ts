import {
  IsEmail,
  IsString,
  IsEnum,
  IsDate,
  IsBoolean,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export type UserRole = 'admin' | 'user' | 'guest';
export type UserGender = 'Female' | 'Male' | 'Other';

export class UserDto {
  @IsString()
  @MaxLength(50)
  first_name: string;

  @IsString()
  @MaxLength(50)
  last_name: string;

  @IsEmail()
  @MaxLength(60)
  email: string;

  @IsString()
  @MaxLength(15)
  @Matches(/^[0-9]+$/, { message: 'Phone must contain only numbers' })
  phone: string;

  @IsEnum(['admin', 'user', 'guest'])
  @IsOptional()
  role?: UserRole = 'user';

  @IsString()
  @MaxLength(500)
  @IsOptional()
  profile_photo?: string;

  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @IsEnum(['Female', 'Male', 'Other'])
  gender: UserGender;

  @IsString()
  @MaxLength(100)
  address: string;

  @IsBoolean()
  @IsOptional()
  user_state?: boolean = false;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}

export type IdUserDto = { id: string };
export type EmailUserDto = { email: string };
export type LoginUserDto = { email: string; password: string };
