import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Member } from 'src/member/entities/member.entity';

export class CreateMembershipDto {
  @IsObject()
  readonly member: Member;

  @IsDate()
  @Type(() => Date)
  readonly startDate: Date;

  @IsNumber()
  @ApiProperty({
    description: 'Duration of membership in months.',
    type: 'number',
  })
  duration: number;

  @IsBoolean()
  @IsOptional()
  paymentCompleted: boolean;

  @IsNumber()
  paymentAmount: number;
}
