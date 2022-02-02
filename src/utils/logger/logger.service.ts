import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { LOGGER_LEVEL } from './logger.constants';

/**
 * Describes a logger instance
 */
interface ILogger {
  /**
   * Logs with an arbitrary level. Defaults to info
   */
  log(msg: string, level: LOGGER_LEVEL, ...meta: any[]): void;

  /**
   * Log detailed information
   */
  debug(msg: string, ...meta: any[]): void;

  /**
   * Runtime errors that do not require immediate action but should typically be logged and monitored
   */
  error(msg: string, ...meta: any[]): void;

  /**
   * Exceptional occurrences that are not errors
   */
  warn(msg: string, ...meta: any[]): void;

  /**
   * Interesting events
   */
  info(msg: string, ...meta: any[]): void;

  /**
   * A simple profiling mechanism, all profile messages are set 'info' level by default
   */
  profile(name: string): void;
}
@Injectable()
export class LoggerService implements ILogger {
  private logger: winston.Logger;

  constructor(logger) {
    this.logger = logger;
  }

  public log(
    msg: string,
    level: LOGGER_LEVEL = LOGGER_LEVEL.INFO,
    ...meta: any[]
  ): void {
    this.logger.log(
      level.toUpperCase() in LOGGER_LEVEL ? level : LOGGER_LEVEL.INFO,
      msg,
      ...meta,
    );
  }

  public debug(msg: string, ...meta: any[]): void {
    this.log(msg, LOGGER_LEVEL.DEBUG, ...meta);
  }

  public error(msg: string, ...meta: (string | object)[]): void {
    this.log(msg, LOGGER_LEVEL.ERROR, ...meta);
  }

  public warn(msg: string, ...meta: any[]): void {
    this.log(msg, LOGGER_LEVEL.WARN, ...meta);
  }

  public info(msg: string, ...meta: any[]): void {
    this.log(msg, LOGGER_LEVEL.INFO, ...meta);
  }

  public profile(name: string): void {
    this.log(name, LOGGER_LEVEL.PROFILE);
  }
}
