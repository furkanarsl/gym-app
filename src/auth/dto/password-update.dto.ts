import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordUpdateDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  passwordVerify: string;
}
