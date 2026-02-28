import { IsNumber, IsString } from 'class-validator';

export class EndSessionDto {
  @IsNumber()
  sessionId: number;

  @IsNumber()
  finalScore: number;

  @IsNumber()
  finalStability: number;

  @IsNumber()
  questionsAnswered: number;

  @IsNumber()
  correctAnswers: number;

  @IsNumber()
  wrongAnswers: number;

  @IsString()
  difficultyReached: string;
}
