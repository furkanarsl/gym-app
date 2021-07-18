import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { Repository } from 'typeorm';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Routine, RoutineToExerciseTarget } from './entities/routine.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseTargetService } from './exercisetarget.service';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(RoutineToExerciseTarget)
    private readonly routineToExerciseTargetRepository: Repository<RoutineToExerciseTarget>,
    private exerciseService: ExerciseService,
    private exerciseTargetService: ExerciseTargetService,
  ) {}

  async create(createRoutineDto: CreateRoutineDto) {
    const routine = this.routineRepository.create(createRoutineDto);
    await this.routineRepository.save(routine);

    const routineToExercises = [];
    for (const [index, exercise] of createRoutineDto.exercises.entries()) {
      const ex = await this.exerciseService.findOne(exercise.id);

      const exTarget = await this.exerciseTargetService.findOneOrCreate({
        exercise: ex,
        ...exercise,
      });
      const routineExTarget = this.routineToExerciseTargetRepository.create({
        exercise: exTarget,
        order: index,
      });
      routineToExercises.push(
        await this.routineToExerciseTargetRepository.save(routineExTarget),
      );
    }
    routine.exercises = routineToExercises;
    return await this.routineRepository.save(routine);
  }

  async findAll(sortParams: SortDto, paginationParams: PaginationDto) {
    const qb = this.routineRepository
      .createQueryBuilder('routine')
      .select(['routine']);

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
    const routine = await this.routineRepository.findOne(id);
    const exerciseTargets = await this.routineToExerciseTargetRepository.find({
      where: { routine: routine },
      relations: ['exercise', 'exercise.exercise'],
    });

    let exList = [];
    for (const exerciseTarget of exerciseTargets) {
      exList.push({
        id: exerciseTarget.exercise.exercise.id,
        reps: exerciseTarget.exercise.reps,
        sets: exerciseTarget.exercise.sets,
      });
    }
    return { ...routine, exercises: exList };
  }

  async update(id: number, updateRoutineDto: UpdateRoutineDto) {
    const routine = await this.routineRepository.preload({
      id,
      name: updateRoutineDto.name,
    });

    const routineExercises = await this.routineToExerciseTargetRepository.find({
      routine: { id: routine.id },
    });

    for (const exercise of routineExercises) {
      await this.routineToExerciseTargetRepository.delete(exercise);
    }
    for (const [index, exercise] of updateRoutineDto.exercises.entries()) {
      const ex = await this.exerciseService.findOne(exercise.id);

      const exTarget = await this.exerciseTargetService.findOneOrCreate({
        exercise: ex,
        ...exercise,
      });

      const routineExTarget =
        await this.routineToExerciseTargetRepository.insert({
          exercise: exTarget,
          routine: routine,
          order: index,
        });
      // await this.routineToExerciseTargetRepository.save(routineExTarget);
    }
    await this.routineRepository.save(routine);
    return;
  }

  async remove(id: number) {
    return await this.routineRepository.delete(id);
  }
}
