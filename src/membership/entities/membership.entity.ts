import { Member } from 'src/member/entities/member.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MembershipStatus } from '../status.enum';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, (member) => member.memberships)
  @JoinColumn()
  member: Member;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: false })
  endDate: Date;

  @Column({ type: 'float' })
  paymentAmount: number;

  @Column({ type: 'bool', default: false, nullable: false })
  paymentCompleted: Boolean;

  @Index('idx-status')
  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE,
  })
  status: MembershipStatus;
}
