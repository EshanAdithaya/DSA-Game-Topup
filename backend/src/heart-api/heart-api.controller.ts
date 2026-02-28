import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { HeartApiService } from './heart-api.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('heart')
@UseGuards(JwtAuthGuard)
export class HeartApiController {
  constructor(private heartApiService: HeartApiService) {}

  @Get('puzzle')
  getPuzzle() {
    return this.heartApiService.getPuzzle();
  }

  @Post('verify')
  async verifyAnswer(@Body() body: { solution: number; userAnswer: number }) {
    const correct = await this.heartApiService.verifyAnswer(body.solution, body.userAnswer);
    return {
      correct,
      message: correct ? 'Dimensional stability restored!' : 'Incorrect answer. Try again!',
    };
  }
}
