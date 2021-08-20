import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Workout } from './entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    private userService: UserService,
  ) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    const workout = this.workoutRepository.create(createWorkoutDto);
    return await this.workoutRepository.save(workout);
  }

  async findAll(sortParams: SortDto, paginationParams: PaginationDto) {
    const qb = this.workoutRepository
      .createQueryBuilder('workout')
      .select(['workout']);

    if (paginationParams) {
      qb.offset(paginationParams.skip);
      qb.limit(paginationParams.limit);
    }

    if (sortParams) {
      qb.orderBy(sortParams.sort, sortParams.order);
    }

    return await qb.getMany();
  }

  async findOne(id: number) {
    return this.workoutRepository.findOneOrFail({
      where: { id },
      relations: ['routines'],
    });
  }

  async findForUser(username: string) {
    const user = await this.userService.findOneByUsername(username);
    const qb = this.workoutRepository.createQueryBuilder('workout');
    return await qb
      .leftJoin('workout.members', 'member')
      .leftJoinAndSelect('workout.routines', 'routines')
      .where('member.id = :id', { id: user.member.id })
      .addSelect(['workout'])
      .getOne();
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    const workout = await this.workoutRepository.preload({
      id,
      ...updateWorkoutDto,
    });
    return await this.workoutRepository.save(workout);
  }

  async remove(id: number) {
    return await this.workoutRepository.delete(id);
  }

  async count() {
    return await this.workoutRepository.count();
  }
}
