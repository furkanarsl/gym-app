import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { Repository } from 'typeorm';
import { CreateExerciseTargetDto } from './dto/create-exercisetarget.dto';
import { Exercise } from './entities/exercise.entity';
import { ExerciseTarget } from './entities/exercisetarget.entity';
import { ExerciseService } from './exercise.service';

@Injectable()
export class ExerciseTargetService {
  constructor(
    @InjectRepository(ExerciseTarget)
    private readonly exerciseTargetRepository: Repository<ExerciseTarget>,
    private exerciseService: ExerciseService,
  ) {}

  async findOneOrCreate(createExerciseTargetDto: CreateExerciseTargetDto) {
    const exercise = await this.exerciseService.findOne(
      createExerciseTargetDto.exercise.id,
    );

    const result = await this.findWithData(
      exercise,
      createExerciseTargetDto.reps,
      createExerciseTargetDto.sets,
    );

    if (!result) {
      const ex = await this.exerciseTargetRepository.insert({
        exercise: exercise,
        ...createExerciseTargetDto,
      });
      // const exerciseTarget = this.exerciseTargetRepository.create({

      // });
      // return await this.exerciseTargetRepository.save(exerciseTarget);
    }
    return await this.findWithData(
      exercise,
      createExerciseTargetDto.reps,
      createExerciseTargetDto.sets,
    );
  }

  async findAll(sortParams?: SortDto, paginationParams?: PaginationDto) {
    const qb = this.exerciseTargetRepository
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

  async findWithData(exercise: Exercise, reps: number, sets: number) {
    const result = await this.exerciseTargetRepository.findOne({
      where: {
        exercise: exercise,
        reps: reps,
        sets: sets,
      },
    });

    return result;
  }

  async findOne(id: number) {
    const exercise = await this.exerciseTargetRepository.findOne(+id);
    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found.`);
    }

    return exercise;
  }
}
