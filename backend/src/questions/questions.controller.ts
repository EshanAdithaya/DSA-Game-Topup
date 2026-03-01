import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get('pool')
  getPoolQuestions() {
    return this.questionsService.getPoolQuestions();
  }

  @Post('generate')
  generateQuestion(@Body() body: { difficulty: string; questionNumber: number }) {
    return this.questionsService.generateAIQuestion(
      body.difficulty || 'medium',
      body.questionNumber || 11,
    );
  }

  @Get('by-difficulty')
  getByDifficulty(@Query('difficulty') difficulty: string, @Query('limit') limit: string) {
    return this.questionsService.getQuestionsByDifficulty(difficulty, parseInt(limit) || 5);
  }
}
