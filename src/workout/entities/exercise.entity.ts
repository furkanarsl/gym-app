import { IsOptional } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseTarget } from './exercisetarget.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  description: string;

  @IsOptional()
  @Column({ nullable: true })
  imgUrl: string;

  @IsOptional()
  @Column({ nullable: true })
  videoUrl: string;

  @OneToMany(
    () => ExerciseTarget,
    (exerciseTargets) => exerciseTargets.exercise,
  )
  exerciseTargets: ExerciseTarget[];
}
