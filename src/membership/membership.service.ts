import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  createQueryBuilder,
  LessThan,
  QueryBuilder,
  Repository,
} from 'typeorm';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import {
  addMonths,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { MemberService } from 'src/member/member.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SortDto } from 'src/common/dto/sort.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MembershipStatus } from './status.enum';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    private memberService: MemberService,
  ) {}

  async create(createMembershipData: CreateMembershipDto) {
    const membershipDuration = createMembershipData.duration;

    const membershipData = {
      endDate: addMonths(createMembershipData.startDate, membershipDuration),
      ...createMembershipData,
    };
    const membership = this.membershipRepository.create(membershipData);

    const member = await this.memberService.findOne(membershipData.member.id);
    membership.member = member;

    return await this.membershipRepository.save(membership);
  }

  async findAll(sortParams?: SortDto, paginationParams?: PaginationDto) {
    const qb = this.membershipRepository
      .createQueryBuilder('membership')
      .leftJoin('membership.member', 'member')
      .leftJoin('member.user', 'user')
      .select(['membership', 'member', 'user.username', 'user.id']);

    if (paginationParams) {
      qb.offset(paginationParams.skip);
      qb.limit(paginationParams.limit);
    }

    if (sortParams) {
      if (sortParams.sort === 'membership.member.user.id') {
        sortParams.sort = 'user.username';
      }
      qb.orderBy(sortParams.sort, sortParams.order);
    }

    return qb.getMany();
  }

  async findAllForMember(id: number) {
    const member = await this.memberService.findOne(id);
    return await this.membershipRepository.find({ member: member });
  }

  async findOne(id: number) {
    const result = await this.membershipRepository
      .createQueryBuilder('membership')
      .leftJoin('membership.member', 'member')
      .leftJoin('member.user', 'user')
      .select(['membership', 'member', 'user.username', 'user.id'])
      .where('membership.id = :membershipID', { membershipID: id })
      .getOne();

    if (!result) {
      throw new NotFoundException(`Membership ${id} not found.`);
    }
    return result;
    // return await this.membershipRepository.findOne(id);
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto) {
    const membership = await this.membershipRepository.preload({
      id: +id,
      ...updateMembershipDto,
    });

    if (!membership) {
      throw new NotFoundException(`Membership ${id} not found.`);
    }
    if (updateMembershipDto.member) {
      const member = await this.memberService.findOne(
        updateMembershipDto.member.id,
      );
      membership.member = member;
    }
    return await this.membershipRepository.save(membership);
  }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }

  async count() {
    return this.membershipRepository.count();
  }

  async monthlyNewMemberships() {
    const rightNow = new Date();
    const result = await this.membershipRepository.count({
      where: {
        startDate: Between(
          startOfMonth(rightNow).toISOString(),
          endOfMonth(rightNow).toISOString(),
        ),
      },
    });
    return result;
  }
  async monthlyRevenue() {
    const rightNow = new Date();
    const result = await this.membershipRepository.find({
      where: {
        startDate: Between(
          startOfMonth(rightNow).toISOString(),
          endOfMonth(rightNow).toISOString(),
        ),
      },
    });

    const revenue: number = result.reduce(
      (total, membership) => total + membership.paymentAmount,
      0,
    );

    return revenue;
  }

  async sixMonthRevenueChartData() {
    const rightNow = new Date();
    const result = await this.membershipRepository.find({
      where: {
        startDate: Between(
          endOfMonth(subMonths(rightNow, 6)).toISOString(),
          endOfMonth(rightNow).toISOString(),
        ),
        paymentCompleted: true,
      },
    });

    var acc = {};
    for (
      let month = rightNow.getMonth();
      month > rightNow.getMonth() - 6;
      month--
    ) {
      acc[month] = 0;
    }

    const chartData = result.reduce((acc, curr) => {
      // @ts-ignore:
      const date = parseISO(curr.startDate);
      acc[date.getMonth()] += curr.paymentAmount;
      return acc;
    }, acc);
    return chartData;
  }
  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'checkForInactiveMemberships ',
  })
  async checkForInactiveMemberships() {
    const rightNow = new Date();
    const dateNow = rightNow.toISOString().slice(0, 10).replace(/-/g, '');
    const results = await this.membershipRepository.find({
      where: { endDate: LessThan(dateNow), status: 'active' },
    });
    for (const result of results) {
      result.status = MembershipStatus.COMPLETED;
      this.membershipRepository.save(result);
    }
  }
}
