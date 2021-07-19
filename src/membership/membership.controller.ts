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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipService } from './membership.service';

@ApiTags('Membership')
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('')
  async createMembership(@Body() createMembershipData: CreateMembershipDto) {
    return await this.membershipService.create(createMembershipData);
  }

  @Get(':id')
  async getMembershipDetails(@Param('id') id: number) {
    return await this.membershipService.findOne(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async getAllMemberships(
    @Req() req,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    req.res.set(
      'content-range',
      (await this.membershipService.count()).toString,
    );
    return await this.membershipService.findAll(sortParams, pagination);
  }

  @Patch(':id')
  async updateMembershipInfo(
    @Param('id') id: number,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return await this.membershipService.update(id, updateMembershipDto);
  }
}
