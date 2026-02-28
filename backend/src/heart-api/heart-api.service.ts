import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HeartApiService {
  private readonly HEART_API_URL = 'http://marcconrad.com/uob/heart/api.php?out=json';

  async getPuzzle() {
    try {
      const response = await axios.get(this.HEART_API_URL, { timeout: 10000 });
      const data = response.data;

      return {
        imageUrl: data.question,
        solution: data.solution,
        message: 'Solve the image puzzle to regain dimensional stability!',
      };
    } catch (error) {
      console.error('Heart API error:', error.message);
      throw new HttpException(
        'Failed to fetch Heart API puzzle. Please try again.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async verifyAnswer(solution: number, userAnswer: number): Promise<boolean> {
    return Number(userAnswer) === Number(solution);
  }
}
