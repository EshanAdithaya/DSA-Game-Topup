import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { StartSessionDto } from './dto/start-session.dto';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('session/start')
  startSession(@Request() req, @Body() dto: StartSessionDto) {
    return this.gameService.startSession(req.user.id);
  }

  @Post('answer')
  submitAnswer(@Request() req, @Body() dto: SubmitAnswerDto) {
    return this.gameService.submitAnswer(req.user.id, dto);
  }

  @Post('session/end')
  endSession(@Request() req, @Body() dto: EndSessionDto) {
    return this.gameService.endSession(req.user.id, dto);
  }

  @Get('sessions')
  getUserSessions(@Request() req) {
    return this.gameService.getUserSessions(req.user.id);
  }
}
