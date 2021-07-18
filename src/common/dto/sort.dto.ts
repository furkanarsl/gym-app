import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SortDto {
  @IsString()
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  order: 'ASC' | 'DESC';
}
