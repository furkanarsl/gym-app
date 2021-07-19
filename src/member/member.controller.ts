import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

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
}
