import { UseGuards } from '@nestjs/common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/jwt-auth-guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipService } from './membership.service';

@ApiTags('Membership')
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post('')
  async createMembership(@Body() createMembershipData: CreateMembershipDto) {
    return await this.membershipService.create(createMembershipData);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get(':id')
  async getMembershipDetails(@Param('id') id: number) {
    return await this.membershipService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async getAllMemberships(
    @Req() req,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    req.res.set('content-range', await this.membershipService.count());
    return await this.membershipService.findAll(sortParams, pagination);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Patch(':id')
  async updateMembershipInfo(
    @Param('id') id: number,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return await this.membershipService.update(id, updateMembershipDto);
  }
}
