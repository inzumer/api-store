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
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials (wrong email or password)',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid password',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with email user@example.com not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected internal server error during login',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred during login.',
        error: 'Internal Server Error',
      },
    },
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
  @ApiResponse({
    status: 404,
    description: 'User with the specified email not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with email user@example.com not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during user lookup by email',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while retrieving user data.',
        error: 'Internal Server Error',
      },
    },
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
  @ApiResponse({
    status: 400,
    description: 'Invalid MongoDB ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid MongoDB ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 649e5d42f62a9c23b8c6e9b7 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during user lookup',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while retrieving user by ID.',
        error: 'Internal Server Error',
      },
    },
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
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID or validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid MongoDB ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 649e5d42f62a9c23b8c6e9b7 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error during user update',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while updating user.',
        error: 'Internal Server Error',
      },
    },
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
  @ApiResponse({
    status: 400,
    description: 'Invalid MongoDB ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid MongoDB ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 649e5d42f62a9c23b8c6e9b7 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during user deactivation',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while trying to deactivate the user.',
        error: 'Internal Server Error',
      },
    },
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
  @ApiResponse({
    status: 400,
    description: 'Invalid MongoDB ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid MongoDB ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 649e5d42f62a9c23b8c6e9b7 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during deletion',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while trying to delete the user.',
        error: 'Internal Server Error',
      },
    },
  })
  async deleteProduct(@Req() req: Request, @Param('id') id: string) {
    return this.usersService.deleteUser(req, id);
  }
}
