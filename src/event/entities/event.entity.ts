import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp' })
  startTime: any;

  @Column({ type: 'timestamp' })
  endTime: any;

  @Column()
  isCompleted: boolean;
}
