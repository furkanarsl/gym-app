import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class EventFilterDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  isCompleted: boolean;
}
