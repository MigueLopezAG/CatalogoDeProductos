import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guards/jwt/jwt.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { Roles } from './decorators/roles.decorator';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Eose the endpoint to register a new user
  @Post('register')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  //Expose the enpoint to login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}