import { IsDefined, IsEmail, MinLength, MaxLength } from 'class-validator';

type UserRole = 'admin' | 'user' | 'guest';

export class UserDto {
  @IsDefined()
  id: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(24)
  password: string;

  @IsDefined()
  role: UserRole;

  @MinLength(2, { message: 'Name is too short' })
  @MaxLength(30, { message: 'Name is too long' })
  name: string;

  @MinLength(2, { message: 'Lastname is too short' })
  @MaxLength(30, { message: 'Lastname is too long' })
  lastname: string;

  img?: string;
}

export type IdUserDto = Pick<UserDto, 'id'>;

export type EmailUserDto = Pick<UserDto, 'email'>;

export type PasswordUserDto = Pick<UserDto, 'password'>;

export type RoleUserDto = Pick<UserDto, 'role'>;

export type NameUserDto = Pick<UserDto, 'name'>;

export type LoginUserDto = Pick<UserDto, 'email' | 'password'>;
