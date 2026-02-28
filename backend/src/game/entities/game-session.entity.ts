import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('game_sessions')
export class GameSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.gameSessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  questionsAnswered: number;

  @Column({ default: 100 })
  finalStability: number;

  @Column({ default: 0 })
  correctAnswers: number;

  @Column({ default: 0 })
  wrongAnswers: number;

  @Column({ default: 'easy' })
  difficultyReached: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  endedAt: Date;

  @CreateDateColumn()
  startedAt: Date;
}
