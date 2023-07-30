import { Logger, createLogger, format, transports } from 'winston';

import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, printf, colorize, errors } = format;

export const buildDevLogger = (): Logger => {
  const formatter = printf(
    ({ level, message, timestamp, stack }) => `${timestamp} [${level}]: ${stack || message}`,
  );

  const infoTransport = new DailyRotateFile({
    filename: `logs/hha-info-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m', // 10MB
    maxFiles: '3d', // keep for 3 days
    level: 'info',
  });

  const errorTransport = new DailyRotateFile({
    filename: `logs/hha-errors-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m', // 10MB
    maxFiles: '3d', // keep for 3 days
    level: 'error',
  });

  const consoleTransport = new transports.Console({
    level: 'debug',
    handleExceptions: true,
  });

  return createLogger({
    level: 'debug',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      formatter,
    ),
    transports: [errorTransport, infoTransport, consoleTransport],
  });
};
