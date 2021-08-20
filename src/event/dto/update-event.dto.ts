import { PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsBoolean()
  isCompleted: boolean;
}
