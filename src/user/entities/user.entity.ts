import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/role.enum';
import { Member } from 'src/member/entities/member.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: false, unique: true })
  @Index()
  username: string;

  @Column({ nullable: false, default: 'abc' })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'bool', nullable: false, default: false })
  completedFirstLogin: boolean;

  @OneToOne(() => Member)
  @JoinColumn()
  @Exclude()
  member: Member;
}
