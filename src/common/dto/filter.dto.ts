import { IsObject } from 'class-validator';

export class FilterDto {
  @IsObject()
  filter: any;
}
