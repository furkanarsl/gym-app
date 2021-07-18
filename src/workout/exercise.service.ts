import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}
  async create(createExerciseDto: CreateExerciseDto) {
    const exercise = this.exerciseRepository.create(createExerciseDto);
    return await this.exerciseRepository.save(exercise);
  }

  async findAll(sortParams?: SortDto, paginationParams?: PaginationDto) {
    const qb = this.exerciseRepository
      .createQueryBuilder('exercise')
      .select(['exercise']);

    if (paginationParams) {
      qb.offset(paginationParams.skip);
      qb.limit(paginationParams.limit);
    }

    if (sortParams) {
      qb.orderBy(sortParams.sort, sortParams.order);
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const exercise = await this.exerciseRepository.findOne(+id);
    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found.`);
    }

    return exercise;
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    const updatedExercise = await this.exerciseRepository.preload({
      id,
      ...updateWorkoutDto,
    });

    return await this.exerciseRepository.save(updatedExercise);
  }

  remove(id: number) {
    return `This action removes a #${id} workout`;
  }
}
