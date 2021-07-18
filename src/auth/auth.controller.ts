import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JWTAuthGuard } from './jwt-auth-guard';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }
  @Roles(Role.USER)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('protected')
  protected(@Request() req) {
    return req.user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  //@Roles(Role.ADMIN)
  //@UseGuards(JWTAuthGuard, RolesGuard)
  @Post('register')
  async register(@Body() registerData: CreateUserDto) {
    return this.authService.register(registerData);
  }
}
