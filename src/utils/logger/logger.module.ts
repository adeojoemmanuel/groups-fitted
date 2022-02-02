import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Logger } from './index';
import { LoggerService } from './logger.service';
import { LoggerExceptionInterceptor } from './loggerException.interceptor';

const loggerProvider = {
  provide: LoggerService,
  useFactory: async () => {
    return Logger;
  },
};

@Global()
@Module({
  providers: [
    loggerProvider,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerExceptionInterceptor,
    },
  ],
  exports: [loggerProvider],
})
export class LoggerModule {}
