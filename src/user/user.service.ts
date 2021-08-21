import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { MemberService } from 'src/member/member.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {
  async onModuleInit() {
    const user = await this.userRepository.findOne({
      where: { role: Role.ADMIN },
    });
    if (!user) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);
      const newAdmin = this.userRepository.create({
        username: process.env.ADMIN_USER,
        password: hashedPassword,
        firstName: 'admin',
        lastName: 'admin',
        role: Role.ADMIN,
      });
      this.userRepository.save(newAdmin);
    }
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private memberService: MemberService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkUsername(createUserDto.username);
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    if (user.role == Role.USER) {
      const member = await this.memberService.create();
      user.member = member;
      await this.userRepository.save(user);
    }
    return user;
  }

  async checkUsername(username: string) {
    const user = await this.userRepository.findOne({ username: username });
    if (user) {
      throw new BadRequestException(`Username ${username} already exists.`);
    }
  }
  async findAll(sortParams?: SortDto, paginationParams?: PaginationDto) {
    const qb = this.userRepository.createQueryBuilder('user').select(['user']);
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

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne(
      { username: username },
      { relations: ['member'] },
    );
    if (!user) {
      throw new NotFoundException(`User ${username} not found.`);
    }
    return user;
  }
  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found.`);
    }
    return this.userRepository.save(user);
  }
  async findForUser(username: string) {
    const user = this.findOneByUsername(username);
    return user;
  }
  async updateForUser(userID: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +userID,
      ...updateUserDto,
    });
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
  async count() {
    return this.userRepository.count();
  }
  async changePassword(username, newPassword) {
    const user = await this.findOneByUsername(username);
    user.password = newPassword;
    return await this.userRepository.save(user);
  }

  async logMembership() {}
}
