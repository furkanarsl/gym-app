import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Member } from 'src/member/entities/member.entity';
import { MembershipStatus } from '../status.enum';

export class UpdateMembershipDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly startDate: Date;

  @IsOptional()
  member: Member;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endDate: Date;

  @IsOptional()
  paymentAmount: number;

  @IsBoolean()
  @IsOptional()
  paymentCompleted: boolean;

  @IsOptional()
  status: MembershipStatus;
}
