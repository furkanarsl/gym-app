import { Member } from 'src/member/entities/member.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoutineService } from '../routine.service';
import { Routine } from './routine.entity';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Routine, (routines) => routines.workouts)
  @JoinTable()
  routines: Routine[];

  @OneToMany(() => Member, (member) => member.workout)
  members: Member[];
}
