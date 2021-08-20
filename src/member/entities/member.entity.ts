import { Membership } from 'src/membership/entities/membership.entity';
import { User } from 'src/user/entities/user.entity';
import { Workout } from 'src/workout/entities/workout.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bool', default: false })
  isActive: boolean;

  @OneToOne(() => User, (user) => user.member)
  user: User;

  @OneToMany(() => Membership, (membership) => membership.member)
  memberships: Membership[];

  @Column({ nullable: true })
  workout_id: number;

  @ManyToOne(() => Workout, (workout) => workout.members)
  @JoinColumn({ name: 'workout_id', referencedColumnName: 'id' })
  workout: Workout;
}
