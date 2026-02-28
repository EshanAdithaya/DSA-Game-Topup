import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GameSession } from '../game/entities/game-session.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(GameSession)
    private gameSessionRepository: Repository<GameSession>,
  ) {}

  async getTopPlayers(limit = 20) {
    const users = await this.usersRepository.find({
      select: ['id', 'username', 'totalScore', 'highestScore', 'gamesPlayed', 'createdAt'],
      order: { highestScore: 'DESC' },
      take: limit,
    });

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      highestScore: user.highestScore,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
      memberSince: user.createdAt,
    }));
  }

  async getUserRank(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'totalScore', 'highestScore', 'gamesPlayed'],
    });

    if (!user) return null;

    const rank = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.highestScore > :score', { score: user.highestScore })
      .getCount();

    return {
      rank: rank + 1,
      userId: user.id,
      username: user.username,
      highestScore: user.highestScore,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
    };
  }

  async getRecentGames(limit = 10) {
    const sessions = await this.gameSessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .where('session.status = :status', { status: 'completed' })
      .orderBy('session.startedAt', 'DESC')
      .take(limit)
      .getMany();

    return sessions.map((s) => ({
      username: s.user?.username || 'Unknown',
      score: s.score,
      questionsAnswered: s.questionsAnswered,
      difficultyReached: s.difficultyReached,
      playedAt: s.startedAt,
    }));
  }
}
