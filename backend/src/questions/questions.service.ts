import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Question } from './entities/question.entity';

const POOL_QUESTIONS = [
  {
    text: 'A fair coin is tossed 3 times. What is the probability of getting exactly 2 heads?',
    optionA: '1/8',
    optionB: '3/8',
    optionC: '1/2',
    optionD: '3/4',
    correctAnswer: 'B',
    difficulty: 'easy',
    explanation: 'C(3,2) × (1/2)² × (1/2)¹ = 3 × 1/4 × 1/2 = 3/8',
  },
  {
    text: 'A bag contains 5 red, 3 blue, and 2 green balls. What is the probability of drawing a red ball?',
    optionA: '1/5',
    optionB: '1/3',
    optionC: '1/2',
    optionD: '5/10',
    correctAnswer: 'C',
    difficulty: 'easy',
    explanation: 'P(red) = 5/10 = 1/2',
  },
  {
    text: 'Two dice are rolled. What is the probability of getting a sum of 7?',
    optionA: '1/6',
    optionB: '5/36',
    optionC: '7/36',
    optionD: '1/3',
    correctAnswer: 'A',
    difficulty: 'easy',
    explanation: 'Favorable outcomes: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6/36 = 1/6',
  },
  {
    text: 'What is the next number in the sequence: 2, 6, 18, 54, ?',
    optionA: '108',
    optionB: '162',
    optionC: '216',
    optionD: '324',
    correctAnswer: 'B',
    difficulty: 'easy',
    explanation: 'Each term is multiplied by 3. 54 × 3 = 162',
  },
  {
    text: 'A card is drawn randomly from a standard deck. What is the probability of drawing an ace?',
    optionA: '1/52',
    optionB: '1/13',
    optionC: '4/52',
    optionD: 'Both B and C',
    correctAnswer: 'D',
    difficulty: 'easy',
    explanation: '4 aces in 52 cards = 4/52 = 1/13',
  },
  {
    text: 'In a class of 30 students, 18 like math and 15 like science. If 10 like both, how many like neither?',
    optionA: '5',
    optionB: '7',
    optionC: '10',
    optionD: '3',
    correctAnswer: 'B',
    difficulty: 'easy',
    explanation: '|M∪S| = 18 + 15 - 10 = 23. Neither = 30 - 23 = 7',
  },
  {
    text: 'What is the probability of rolling a number greater than 4 on a standard die?',
    optionA: '1/3',
    optionB: '1/2',
    optionC: '2/3',
    optionD: '1/6',
    correctAnswer: 'A',
    difficulty: 'easy',
    explanation: 'Numbers > 4: {5, 6} = 2 outcomes out of 6. P = 2/6 = 1/3',
  },
  {
    text: 'A box has 4 white and 6 black marbles. Two marbles are drawn without replacement. What is P(both white)?',
    optionA: '1/5',
    optionB: '2/15',
    optionC: '1/15',
    optionD: '4/25',
    correctAnswer: 'B',
    difficulty: 'easy',
    explanation: 'P = (4/10) × (3/9) = 12/90 = 2/15',
  },
  {
    text: 'What is the expected value when rolling a fair 6-sided die?',
    optionA: '3',
    optionB: '3.5',
    optionC: '4',
    optionD: '3.2',
    correctAnswer: 'B',
    difficulty: 'easy',
    explanation: 'E = (1+2+3+4+5+6)/6 = 21/6 = 3.5',
  },
  {
    text: 'If P(A) = 0.4 and P(B) = 0.3 and A and B are mutually exclusive, what is P(A or B)?',
    optionA: '0.12',
    optionB: '0.58',
    optionC: '0.7',
    optionD: '1.0',
    correctAnswer: 'C',
    difficulty: 'easy',
    explanation: 'For mutually exclusive events: P(A or B) = P(A) + P(B) = 0.4 + 0.3 = 0.7',
  },
  {
    text: 'Three people A, B, C each independently solve a problem with probabilities 1/2, 1/3, 1/4 respectively. What is the probability that exactly one solves it?',
    optionA: '1/4',
    optionB: '11/24',
    optionC: '1/2',
    optionD: '3/8',
    correctAnswer: 'B',
    difficulty: 'medium',
    explanation: 'P = (1/2)(2/3)(3/4) + (1/2)(1/3)(3/4) + (1/2)(2/3)(1/4) = 6/24 + 3/24 + 2/24 = 11/24',
  },
  {
    text: 'In a sequence 1, 4, 9, 16, 25... what is the pattern and the 10th term?',
    optionA: 'n², 81',
    optionB: 'n², 100',
    optionC: '2n², 200',
    optionD: 'n+3, 13',
    correctAnswer: 'B',
    difficulty: 'medium',
    explanation: 'Pattern is perfect squares: n². 10th term = 10² = 100',
  },
  {
    text: 'A biased coin lands heads with probability 0.6. If tossed 5 times, what is P(exactly 3 heads)?',
    optionA: '0.2304',
    optionB: '0.3456',
    optionC: '0.2592',
    optionD: '0.1296',
    correctAnswer: 'B',
    difficulty: 'medium',
    explanation: 'C(5,3) × 0.6³ × 0.4² = 10 × 0.216 × 0.16 = 0.3456',
  },
  {
    text: 'What is the probability that a randomly chosen 2-digit number is divisible by both 3 and 5?',
    optionA: '1/10',
    optionB: '1/15',
    optionC: '6/90',
    optionD: '1/3',
    correctAnswer: 'C',
    difficulty: 'medium',
    explanation: 'Numbers 10-99 divisible by 15: {15,30,45,60,75,90} = 6. Total 2-digit = 90. P = 6/90 = 1/15',
  },
  {
    text: 'A game costs $2 to play. You roll a die: win $5 if you roll 6, $0 otherwise. What is the expected profit per game?',
    optionA: '-$1.17',
    optionB: '-$0.50',
    optionC: '$0.83',
    optionD: '-$1.50',
    correctAnswer: 'A',
    difficulty: 'medium',
    explanation: 'E = (1/6)×5 + (5/6)×0 - 2 = 0.833 - 2 = -$1.167',
  },
];

@Injectable()
export class QuestionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const count = await this.questionsRepository.count();
    if (count === 0) {
      await this.seedQuestions();
    }
  }

  private async seedQuestions() {
    const questions = POOL_QUESTIONS.map((q) =>
      this.questionsRepository.create({ ...q, category: 'probability', isPool: true }),
    );
    await this.questionsRepository.save(questions);
    console.log(`Seeded ${questions.length} pool questions`);
  }

  async getPoolQuestions(): Promise<Question[]> {
    return this.questionsRepository.find({
      where: { isPool: true, difficulty: 'easy' },
      take: 10,
      order: { id: 'ASC' },
    });
  }

  async getQuestionsByDifficulty(difficulty: string, limit = 5): Promise<Question[]> {
    return this.questionsRepository.find({
      where: { difficulty },
      take: limit,
      order: { id: 'ASC' },
    });
  }

  async generateAIQuestion(difficulty: string, questionNumber: number): Promise<any> {
    const apiKey = this.configService.get('GEMINI_API_KEY');

    if (!apiKey) {
      return this.getFallbackQuestion(difficulty, questionNumber);
    }

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Generate a ${difficulty} difficulty probability or logical reasoning question for a game.
      Question number: ${questionNumber}

      Return ONLY a JSON object with this exact structure:
      {
        "text": "question text here",
        "optionA": "option A text",
        "optionB": "option B text",
        "optionC": "option C text",
        "optionD": "option D text",
        "correctAnswer": "A or B or C or D",
        "explanation": "brief explanation"
      }

      Make the question unique, engaging, and test probability/logic skills. No markdown, just JSON.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          id: `ai-${Date.now()}`,
          ...parsed,
          difficulty,
          category: 'ai-generated',
          isPool: false,
        };
      }
    } catch (err) {
      console.error('Gemini API error:', err.message);
    }

    return this.getFallbackQuestion(difficulty, questionNumber);
  }

  private getFallbackQuestion(difficulty: string, questionNumber: number) {
    const fallbacks = {
      easy: [
        {
          text: `[Q${questionNumber}] A bag has 3 red and 7 blue balls. What is P(drawing red)?`,
          optionA: '3/10', optionB: '7/10', optionC: '1/3', optionD: '3/7',
          correctAnswer: 'A', explanation: '3 red out of 10 total = 3/10',
        },
        {
          text: `[Q${questionNumber}] A fair die is rolled. What is P(even number)?`,
          optionA: '1/6', optionB: '1/3', optionC: '1/2', optionD: '2/3',
          correctAnswer: 'C', explanation: 'Even numbers: {2,4,6} = 3/6 = 1/2',
        },
      ],
      medium: [
        {
          text: `[Q${questionNumber}] Events A and B are independent with P(A)=0.5, P(B)=0.4. Find P(A and B).`,
          optionA: '0.2', optionB: '0.9', optionC: '0.45', optionD: '0.1',
          correctAnswer: 'A', explanation: 'P(A∩B) = P(A)×P(B) = 0.5×0.4 = 0.2',
        },
      ],
      hard: [
        {
          text: `[Q${questionNumber}] Given P(A|B)=0.7, P(B)=0.3, P(A)=0.4, find P(B|A) using Bayes theorem.`,
          optionA: '0.525', optionB: '0.21', optionC: '0.3', optionD: '0.7',
          correctAnswer: 'A', explanation: 'P(B|A) = P(A|B)×P(B)/P(A) = 0.7×0.3/0.4 = 0.525',
        },
      ],
    };

    const options = fallbacks[difficulty] || fallbacks.easy;
    const q = options[questionNumber % options.length];

    return {
      id: `fallback-${Date.now()}`,
      ...q,
      difficulty,
      category: 'probability',
      isPool: false,
    };
  }
}
