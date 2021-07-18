import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';
import { RoutineToExerciseTarget } from './routine.entity';

@Entity()
export class ExerciseTarget {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.exerciseTargets)
  exercise: Exercise;

  @Column()
  sets: number;

  @Column()
  reps: number;

  @OneToMany(
    () => RoutineToExerciseTarget,
    (exerciseToRoutine) => exerciseToRoutine.exercise,
  )
  exerciseToRoutine: RoutineToExerciseTarget;
}
