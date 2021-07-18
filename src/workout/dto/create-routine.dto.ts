import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { ExerciseTarget } from '../entities/exercisetarget.entity';

export class Exercise {
  id: number;
  sets: number;
  reps: number;
}

export class CreateRoutineDto {
  @IsString()
  name: string;
  @IsArray()
  exercises: Exercise[];
}
