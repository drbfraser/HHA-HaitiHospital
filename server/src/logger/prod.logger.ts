import { createLogger, format, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, errors, json } = format;

const infoTransport = new DailyRotateFile({
  filename: `logs/hha-info-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '10m', // 10MB
  maxFiles: '3d', // keep for 3 days
  level: 'info'
});

const errorTransport = new DailyRotateFile({
  filename: `logs/hha-errors-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '10m', // 10MB
  maxFiles: '3d', // keep for 3 days
  level: 'error'
});

infoTransport.on('rotate', function (oldFilename, newFilename) {
  // can upload files somewhere
});

errorTransport.on('rotate', function (oldFilename, newFilename) {
  // can upload files somewhere
});

export const buildProdLogger = (): Logger => {
  // NOTE: this only stores logs in files, and does not log to console
  // we might want to consider loggging to cloudwatch or mongodb or something

  return createLogger({
    level: 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [errorTransport, infoTransport]
  });
};
