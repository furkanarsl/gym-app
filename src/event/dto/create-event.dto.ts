import { Type } from 'class-transformer';
import { IsDate, IsMilitaryTime, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsMilitaryTime()
  startTime: string;

  @IsString()
  @IsMilitaryTime()
  endTime: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  imgUrl: string;

  
}
