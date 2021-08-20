import { Body, Param, UseGuards } from '@nestjs/common';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth-guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async getAllMembers(
    @Req() req,
    @Query('memberId') memberId: number,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    if (memberId) {
      // return await this.memberService.findAllForMember(+memberId);
    }
    req.res.set('content-range', (await this.memberService.count()).toString());
    return await this.memberService.findAll(sortParams, pagination);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get(':id')
  async getMember(@Param('id') id: number) {
    return await this.memberService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Patch(':id')
  async updateMember(@Param('id') id: number, @Body() data: UpdateMemberDto) {
    return await this.memberService.update(id, data);
  }
}
