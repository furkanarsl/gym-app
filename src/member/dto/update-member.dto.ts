import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateMemberDto } from './create-member.dto';

// export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
export class UpdateMemberDto {
  @IsNumber()
  workout_id: number;
}
