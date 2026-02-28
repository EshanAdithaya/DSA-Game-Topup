import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  getTopPlayers(@Query('limit') limit: string) {
    return this.leaderboardService.getTopPlayers(parseInt(limit) || 20);
  }

  @Get('user/:userId')
  getUserRank(@Param('userId') userId: string) {
    return this.leaderboardService.getUserRank(parseInt(userId));
  }

  @Get('recent')
  getRecentGames(@Query('limit') limit: string) {
    return this.leaderboardService.getRecentGames(parseInt(limit) || 10);
  }
}
