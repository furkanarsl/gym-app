import { PartialType } from '@nestjs/swagger';
import { IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @IsMobilePhone()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
