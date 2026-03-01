import { Module } from '@nestjs/common';
import { HeartApiController } from './heart-api.controller';
import { HeartApiService } from './heart-api.service';

@Module({
  controllers: [HeartApiController],
  providers: [HeartApiService],
  exports: [HeartApiService],
})
export class HeartApiModule {}
