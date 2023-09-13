import * as Transport from 'winston-transport';

import { Logger, createLogger, format, transports } from 'winston';

import LokiTransport from 'winston-loki';

const { combine, timestamp, printf, align, json } = format;

export const buildDevLogger = (): Logger => {
  const formatter = printf(
    ({ level, message, timestamp, stack, label }) =>
      `[${timestamp}][${label}][${level}]: ${stack || message}`,
  );

  const lokiTransport =
    process.env.LOKI_URL &&
    new LokiTransport({
      host: process.env.LOKI_URL,
      labels: { app: 'hhahaiti_local' },
      json: true,
      format: combine(timestamp(), json(), align()),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
      level: 'silly',
    });

  const consoleTransport = new transports.Console({
    level: 'debug',
    handleExceptions: true,
    format: combine(timestamp(), formatter, align()),
  });

  const transport: Transport[] = [consoleTransport];

  lokiTransport && transport.push(lokiTransport);

  return createLogger({
    defaultMeta: {
      label: 'dev',
    },
    transports: transport,
  });
};
