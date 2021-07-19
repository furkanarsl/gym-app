import { IsArray, IsString } from 'class-validator';
import { Routine } from '../entities/routine.entity';

export class CreateWorkoutDto {
  @IsString()
  name: string;

  @IsArray()
  routines: Routine[];
}
