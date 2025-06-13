/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

/** Commons */
import { ApiCommonError } from '../common/decorators/swagger.decorators';
import {
  LoginExample,
  EmailExample,
  UserExample,
  PartialUserExample,
} from '../common/examples/user.example';

/** Nest */
import { Controller, Delete, Post, Put, Body, Param } from '@nestjs/common';

/** User dependencies */
import { UserService } from './user.service';
import { UserDto, LoginUserDto, EmailUserDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    required: true,
    schema: { example: PartialUserExample },
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    schema: { example: UserExample },
  })
  @ApiCommonError('Create user')
  async create(@Body() data: UserDto) {
    return this.usersService.createUser(data);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    required: true,
    schema: {
      example: LoginExample,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in',
    schema: { example: UserExample },
  })
  @ApiCommonError('Login')
  async login(@Body() credentials: LoginUserDto) {
    return this.usersService.validateUserCredentials(credentials);
  }

  @Post('/find-by-email')
  @ApiOperation({ summary: 'Find user by email' })
  @ApiBody({
    required: true,
    schema: { example: EmailExample },
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: { example: UserExample },
  })
  @ApiCommonError('Email')
  async findByEmail(@Body() email: EmailUserDto) {
    return this.usersService.findByEmail(email);
  }

  @Post('/find-by-id/:id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: { example: UserExample },
  })
  @ApiCommonError('ID')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({
    required: true,
    schema: { example: PartialUserExample },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    schema: { example: UserExample },
  })
  @ApiCommonError('Update')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: Partial<UserDto>,
  ) {
    return this.usersService.updateUser(id, updateData);
  }

  @Put('/soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'User soft deleted',
    schema: { example: UserExample },
  })
  @ApiCommonError('Soft delete')
  async softDelete(@Param('id') id: string) {
    return this.usersService.softDeleteUser(id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    schema: { example: UserExample },
  })
  @ApiCommonError('Delete')
  async deleteProduct(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
