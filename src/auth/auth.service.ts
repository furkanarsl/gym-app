import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import {} from 'pg';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from './role.enum';
import { PasswordUpdateDto } from './dto/password-update.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    await this.verifyPassword(password, user.password);
    return user;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isMatchingPassword = await bcrypt.compare(
      plainPassword,
      hashedPassword,
    );
    if (!isMatchingPassword) {
      throw new UnauthorizedException('Invalid username or password.');
    }
  }

  async login(user: LoginUserDto, adminLogin?: boolean) {
    const validatedUser = await this.validateUser(user.username, user.password);

    if (adminLogin && validatedUser.role !== Role.ADMIN) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const payload = {
      username: validatedUser.username,
      sub: validatedUser.id,
      role: validatedUser.role,
    };
    return {
      access_token: this.jwtService.sign({ type: 'access', ...payload }),
      refresh_token: this.jwtService.sign(
        { type: 'refresh', ...payload },
        { expiresIn: '7d' },
      ),
    };
  }

  async register(registerData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const userData = {
      ...registerData,
      password: hashedPassword,
    };
    const createdUser = await this.userService.create(userData);
    // createdUser.password = undefined;
    return createdUser;
  }

  async refresh(username: string, type: string) {
    if (type !== 'refresh') {
      throw new UnauthorizedException('Invalid Token');
    }
    const user = await this.userService.findOneByUsername(username);
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign({ type: 'access', ...payload }),
    };
  }

  async verifyToken(token: string) {
    return await this.jwtService.verify(token);
  }

  async changePassword(username:string,passwordUpdateDto:PasswordUpdateDto){
    const {newPassword, passwordVerify} = passwordUpdateDto;
    if (newPassword !== passwordVerify){
      throw new BadRequestException("Passwords don't match.")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userService.changePassword(username,hashedPassword);
  }
  
}
