import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExerciseTarget } from './exercisetarget.entity';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @ManyToMany(() => ExerciseTarget)
  // @JoinTable()
  // exercises: ExerciseTarget[];

  @OneToMany(
    () => RoutineToExerciseTarget,
    (routineToExercise) => routineToExercise.routine,
  )
  exercises: RoutineToExerciseTarget[];
}

@Entity()
export class RoutineToExerciseTarget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @ManyToOne(() => Routine, (routine) => routine.exercises, {
    onDelete: 'CASCADE',
  })
  routine: Routine;

  @ManyToOne(() => ExerciseTarget, (exercise) => exercise.exerciseToRoutine)
  exercise: ExerciseTarget;
}
