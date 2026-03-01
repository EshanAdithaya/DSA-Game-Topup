import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column()
  optionA: string;

  @Column()
  optionB: string;

  @Column()
  optionC: string;

  @Column()
  optionD: string;

  @Column({ length: 1 })
  correctAnswer: string;

  @Column({ default: 'easy' })
  difficulty: string;

  @Column({ default: 'probability' })
  category: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ default: true })
  isPool: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
