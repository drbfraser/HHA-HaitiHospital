import * as Transport from 'winston-transport';

import { Logger, createLogger, format } from 'winston';

import DailyRotateFile from 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';

const { combine, timestamp, errors, json } = format;

export const buildProdLogger = (): Logger => {
  // NOTE: this only stores logs in files, and does not log to console
  // we might want to consider loggging to cloudwatch or mongodb or something
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

  const lokiTransport =
    process.env.LOKI_URL &&
    process.env.LOKI_USER &&
    process.env.LOKI_KEY &&
    new LokiTransport({
      host: process.env.LOKI_URL,
      basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_KEY}`,
      labels: { app: process.env.LOKI_APP_LABEL ?? 'hhahaiti' },
      json: true,
      format: format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    });

  const transports: Transport[] = [infoTransport, errorTransport];

  lokiTransport && transports.push(lokiTransport);

  return createLogger({
    level: 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: transports,
  });
};
