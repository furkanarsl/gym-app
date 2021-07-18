import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Exercise } from '../entities/exercise.entity';

export class CreateExerciseTargetDto {
  @Type(() => Exercise)
  exercise: Exercise;
  @IsNumber()
  sets: number;
  @IsNumber()
  reps: number;
}
