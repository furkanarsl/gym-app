import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  @InjectRepository(Member)
  private readonly memberRepository: Repository<Member>;

  async create() {
    const member = this.memberRepository.create();
    return await this.memberRepository.save(member);
  }

  async findAll(sortParams?: SortDto, paginationParams?: PaginationDto) {
    const qb = this.memberRepository
      .createQueryBuilder('member')
      .leftJoin('member.user', 'user')
      .select([
        'member',
        'user.username',
        'user.id',
        'user.firstName',
        'user.lastName',
      ]);

    if (paginationParams) {
      qb.offset(paginationParams.skip);
      qb.limit(paginationParams.limit);
    }

    if (sortParams) {
      if (sortParams.sort === 'member.user.id') {
        sortParams.sort = 'user.username';
      }
      qb.orderBy(sortParams.sort, sortParams.order);
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const member = await this.memberRepository.findOne(id);
    if (!member) {
      throw new BadRequestException(
        'Invalid member',
        `Failed to find the member with the given id of ${id}.`,
      );
    }
    return member;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async count() {
    return this.memberRepository.count();
  }

  async memberWithUsernames() {
    return await this.memberRepository
      .createQueryBuilder('member')
      .leftJoin('member.user', 'user')
      .where('user.role = :role', { role: Role.USER })
      .select(['member.id AS id', '(user.username) AS username'])
      .getRawMany();
  }
}
