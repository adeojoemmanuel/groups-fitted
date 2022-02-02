import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerExceptionInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().do(null, (exception) => {
      if (exception instanceof HttpException) {
        // If 500, log as error
        if (500 <= exception.getStatus()) {
          this.loggerService.error('HttpException ' + exception.getStatus());
          request && this.loggerService.error('Request Path', request.path);
          this.loggerService.error(
            'Exception Response ',
            exception.getResponse(),
          );
        } else {
          this.loggerService.error('HttpException ' + exception.getStatus());
          request && this.loggerService.error('Request Path', request.path);
          this.loggerService.error(
            'Exception Response ',
            exception.getResponse(),
          );
        }
      } else {
        this.loggerService.error(
          'Unexpected error ',
          request && request.path,
          exception,
        );
        request && this.loggerService.error('Request Path', request.path);
        this.loggerService.error('Exception ', exception);
      }
    });
  }
}
