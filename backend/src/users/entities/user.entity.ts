import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GameSession } from '../../game/entities/game-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 100 })
  username: string;

  @Column({ default: 0 })
  totalScore: number;

  @Column({ default: 0 })
  gamesPlayed: number;

  @Column({ default: 0 })
  highestScore: number;

  @OneToMany(() => GameSession, (session) => session.user)
  gameSessions: GameSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
