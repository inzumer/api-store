/** Swagger */
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

/** Commons */
import {
  LoginExample,
  EmailExample,
  UserExample,
  PartialUserExample,
} from '../common/examples/user.example';

/** Nest */
import {
  Controller,
  Delete,
  Post,
  Put,
  Body,
  Param,
  Req,
} from '@nestjs/common';

/** User dependencies */
import { UserService } from './user.service';

/** DTO */
import { UserDto, LoginUserDto, EmailUserDto } from './dto';

/** Express */
import { Request } from 'express';

/** Decorators */
import { CommonHeaders } from '../common/decorators';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiHeader({
    name: 'request-id',
    description: 'Unique request identifier to trace requests across services',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    required: true,
    schema: { example: PartialUserExample },
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    schema: { example: UserExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data or creation failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'User creation failed due to invalid data or server error.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during user creation',
    schema: {
      example: {
        statusCode: 500,
        message: 'User creation failed due to invalid data or server error.',
        error: 'Internal Server Error',
      },
    },
  })
  async create(@Req() req: Request, @Body() data: UserDto) {
    return this.usersService.createUser(req, data);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiHeader({
    name: 'request-id',
    description: 'Unique request identifier to trace requests across services',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
  async login(@Req() req: Request, @Body() credentials: LoginUserDto) {
    return this.usersService.validateUserCredentials(req, credentials);
  }

  @Post('/find-by-email')
  @ApiOperation({ summary: 'Find user by email' })
  @CommonHeaders()
  @ApiBody({
    required: true,
    schema: { example: EmailExample },
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: { example: UserExample },
  })
  async findByEmail(@Req() req: Request, @Body() email: EmailUserDto) {
    return this.usersService.findByEmail(req, email);
  }

  @Post('/find-by-id/:id')
  @ApiOperation({ summary: 'Find user by ID' })
  @CommonHeaders()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: { example: UserExample },
  })
  async findById(@Req() req: Request, @Param('id') id: string) {
    return this.usersService.findById(req, id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @CommonHeaders()
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
  async updateUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateData: Partial<UserDto>,
  ) {
    return this.usersService.updateUser(req, id, updateData);
  }

  @Put('/soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @CommonHeaders()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'User soft deleted',
    schema: { example: UserExample },
  })
  async softDelete(@Req() req: Request, @Param('id') id: string) {
    return this.usersService.softDeleteUser(req, id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @CommonHeaders()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    schema: {
      example: {
        message: 'User 683670955dbc65f5c48871a2 deleted successfully',
      },
    },
  })
  async deleteProduct(@Req() req: Request, @Param('id') id: string) {
    return this.usersService.deleteUser(req, id);
  }
}
