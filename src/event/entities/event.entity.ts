import { IsMilitaryTime, IsOptional, Matches } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @IsMilitaryTime()
  @Column({ type: 'text' })
  startTime: any;

  @IsMilitaryTime()
  @Column({ type: 'text' })
  endTime: any;

  @Column({ default: false })
  isCompleted: boolean;

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  description: string;

  @IsOptional()
  @Column({ nullable: true })
  imgUrl: string;
}
