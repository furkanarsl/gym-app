import { UseGuards } from '@nestjs/common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/jwt-auth-guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Req() req: Request,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    req.res.set('content-range', (await this.userService.count()).toString());
    return await this.userService.findAll(sortParams, pagination);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/me')
  async findForUser(@Req() req) {
    return await this.userService.findForUser(req.user.username);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/me')
  async updateForUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateForUser(req.user.id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
