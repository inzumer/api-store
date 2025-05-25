import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { UserDto, LoginUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get('/')
  hello() {
    return 'Hello World!';
  }

  /**
   * Creates a new user.
   * @param data - The user data to create.
   * @returns The created user object.
   */
  @Post('/create-user')
  async create(@Body() data: UserDto) {
    return this.usersService.createUser(data);
  }

  /**
   * Validates user login credentials.
   * @param credentials - The user credentials.
   * @returns The user if credentials are valid.
   */
  @Post('/login')
  async login(@Body() credentials: LoginUserDto) {
    return this.usersService.validateUserCredentials(credentials);
  }
}
