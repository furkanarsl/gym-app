import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordUpdateDto } from './dto/password-update.dto';
import { JWTAuthGuard } from './jwt-auth-guard';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  @HttpCode(200)
  @Post('login/admin')
  async adminLogin(@Body() user: LoginUserDto) {
    return this.authService.login(user, true);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JWTAuthGuard)
  @Patch('change_password')
  async changePassword(
    @Req() req,
    @Body() passwordUpdateDto: PasswordUpdateDto,
  ) {
    return this.authService.changePassword(
      req.user.username,
      passwordUpdateDto,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post('register')
  async register(@Body() registerData: CreateUserDto) {
    return this.authService.register(registerData);
  }

  @UseGuards(JWTAuthGuard)
  @Get('verify-token')
  async verifyToken(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.verifyToken(token);
    return 'Ok.';
  }

  @UseGuards(JWTAuthGuard)
  @Get('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refresh(req.user.username, req.user.type);
  }
}
