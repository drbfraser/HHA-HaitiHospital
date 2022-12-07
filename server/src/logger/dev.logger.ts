import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, printf, colorize, errors } = format;

export const buildDevLogger = (): Logger => {
  const formatter = printf(({ level, message, timestamp, stack }) => `${timestamp} [${level}]: ${stack || message}`);

  return createLogger({
    level: 'debug',
    format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), formatter),
    transports: [new transports.Console({ handleExceptions: true })]
  });
};
