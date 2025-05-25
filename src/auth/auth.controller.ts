import { Controller, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  hello() {
    return 'Hello World!';
  }

  @Get('/signin')
  create(@Body('auth') auth: string) {
    return this.authService.auth(auth);
  }
}
