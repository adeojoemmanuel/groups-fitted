import { green, yellow } from 'colors/safe';
import * as winston from 'winston';
import { transports } from 'winston';
import { config } from '../../config';

export abstract class WinstonLogger {
  private constructor() {}

  static init(): winston.Logger {
    return winston.createLogger({
      level: config.logLevel,
      transports: config.isDevelopment
        ? [
            new transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf((log) => {
                  return (
                    `${green('[Server]')} ` +
                    `${
                      log.level.charAt(0).toUpperCase() + log.level.slice(1)
                    }\t` +
                    (log.timestamp
                      ? `${new Date(log.timestamp).toLocaleString()} `
                      : '') +
                    (log.context ? `${yellow('[' + log.context + ']')} ` : '') +
                    `${green(log.message)}`
                  );
                }),
              ),
            }),
          ]
        : [
            new transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
          ],
    });
  }
}
