import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  imgUrl: string;

  @IsUrl()
  @IsOptional()
  videoUrl: string;
}
