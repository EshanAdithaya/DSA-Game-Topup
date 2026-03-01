import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession } from './entities/game-session.entity';
import { UsersService } from '../users/users.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { EndSessionDto } from './dto/end-session.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameSession)
    private gameSessionRepository: Repository<GameSession>,
    private usersService: UsersService,
  ) {}

  async startSession(userId: number) {
    const session = this.gameSessionRepository.create({
      userId,
      score: 0,
      questionsAnswered: 0,
      finalStability: 100,
      correctAnswers: 0,
      wrongAnswers: 0,
      difficultyReached: 'easy',
      status: 'active',
    });

    const saved = await this.gameSessionRepository.save(session);
    return { sessionId: saved.id, message: 'Game session started' };
  }

  calculateScore(dto: SubmitAnswerDto): number {
    const isCorrect = dto.answer === dto.correctAnswer;
    if (!isCorrect) return 0;

    const BASE_POINTS = 100;
    const TIME_BONUS = dto.timeRemaining * 5;
    const STREAK_MULTIPLIER = Math.min(1 + dto.streak * 0.1, 3.0);

    return Math.round((BASE_POINTS + TIME_BONUS) * STREAK_MULTIPLIER);
  }

  async submitAnswer(userId: number, dto: SubmitAnswerDto) {
    const session = await this.gameSessionRepository.findOne({
      where: { id: dto.sessionId, userId, status: 'active' },
    });

    if (!session) throw new NotFoundException('Active game session not found');

    const isCorrect = dto.answer === dto.correctAnswer;
    const points = this.calculateScore(dto);

    session.questionsAnswered += 1;
    if (isCorrect) {
      session.correctAnswers += 1;
      session.score += points;
    } else {
      session.wrongAnswers += 1;
    }

    await this.gameSessionRepository.save(session);

    return {
      correct: isCorrect,
      points,
      totalScore: session.score,
      questionsAnswered: session.questionsAnswered,
    };
  }

  async endSession(userId: number, dto: EndSessionDto) {
    const session = await this.gameSessionRepository.findOne({
      where: { id: dto.sessionId, userId },
    });

    if (!session) throw new NotFoundException('Game session not found');

    session.score = dto.finalScore;
    session.finalStability = dto.finalStability;
    session.questionsAnswered = dto.questionsAnswered;
    session.correctAnswers = dto.correctAnswers;
    session.wrongAnswers = dto.wrongAnswers;
    session.difficultyReached = dto.difficultyReached;
    session.status = 'completed';
    session.endedAt = new Date();

    await this.gameSessionRepository.save(session);
    await this.usersService.updateScore(userId, dto.finalScore);

    return {
      message: 'Game session ended',
      finalScore: dto.finalScore,
      sessionId: dto.sessionId,
    };
  }

  async getUserSessions(userId: number) {
    return this.gameSessionRepository.find({
      where: { userId, status: 'completed' },
      order: { startedAt: 'DESC' },
      take: 10,
    });
  }
}
