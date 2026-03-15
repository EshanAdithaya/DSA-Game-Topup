import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HeartApiService {
  private readonly HEART_API_URL = 'http://marcconrad.com/uob/heart/api.php?out=json';

  async getPuzzle() {
    try {
      const response = await axios.get(this.HEART_API_URL, { timeout: 10000 });
      const data = response.data;

      // Fetch the image server-side and return as base64 data URL to avoid
      // browser-side hotlinking/CORS issues with sanfoh.com
      let imageUrl = data.question;
      try {
        const imgResponse = await axios.get(data.question, {
          responseType: 'arraybuffer',
          timeout: 10000,
          headers: { 'Referer': 'http://marcconrad.com/' },
        });
        const base64 = Buffer.from(imgResponse.data).toString('base64');
        const contentType = imgResponse.headers['content-type'] || 'image/png';
        imageUrl = `data:${contentType};base64,${base64}`;
      } catch (imgError: any) {
        console.error('Failed to proxy image, using direct URL:', imgError?.message);
        // Fall back to the original URL
      }

      return {
        imageUrl,
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
