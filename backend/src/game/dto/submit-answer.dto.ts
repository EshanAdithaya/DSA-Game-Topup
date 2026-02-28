import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class SubmitAnswerDto {
  @IsNumber()
  sessionId: number;

  @IsString()
  questionId: string;

  @IsString()
  answer: string;

  @IsString()
  correctAnswer: string;

  @IsNumber()
  timeRemaining: number;

  @IsNumber()
  questionNumber: number;

  @IsNumber()
  streak: number;
}
