import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { GameModule } from './game/game.module';
import { HeartApiModule } from './heart-api/heart-api.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { User } from './users/entities/user.entity';
import { Question } from './questions/entities/question.entity';
import { GameSession } from './game/entities/game-session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', 'quantum_quest'),
        entities: [User, Question, GameSession],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    QuestionsModule,
    GameModule,
    HeartApiModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
