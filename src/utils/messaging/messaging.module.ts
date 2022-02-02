import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { MessagingService } from './messaging.service';

@Module({
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
