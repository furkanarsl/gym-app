import { Member } from 'src/member/entities/member.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Routine } from './routine.entity';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Routine)
  @JoinTable()
  routines: Routine[];

  @OneToMany(() => Member, (member) => member.workout)
  member: Member;
}
