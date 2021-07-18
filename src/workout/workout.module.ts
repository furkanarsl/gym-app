import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { Workout } from './entities/workout.entity';
import { Routine, RoutineToExerciseTarget } from './entities/routine.entity';
import { ExerciseTarget } from './entities/exercisetarget.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';
import { ExerciseTargetService } from './exercisetarget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exercise,
      Workout,
      Routine,
      ExerciseTarget,
      RoutineToExerciseTarget,
    ]),
  ],
  controllers: [WorkoutController, ExerciseController, RoutineController],
  providers: [
    WorkoutService,
    ExerciseService,
    RoutineService,
    ExerciseTargetService,
  ],
})
export class WorkoutModule {}
