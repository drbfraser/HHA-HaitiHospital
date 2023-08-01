import { Logger, createLogger, format, transports } from 'winston';

import LokiTransport from 'winston-loki';

const { combine, timestamp, printf, align } = format;

export const buildDevLogger = (): Logger => {
  const formatter = printf(
    ({ level, message, timestamp, stack, label }) =>
      `[${timestamp}][${label}][${level}]: ${stack || message}`,
  );

  const lokiTransport = new LokiTransport({
    host: 'http://loki:3100',
    labels: { app: 'hhahaiti_local' },
    json: true,
    format: format.json(),
    replaceTimestamp: true,
    onConnectionError: (err) => console.error(err),
  });

  const consoleTransport = new transports.Console({
    level: 'debug',
    handleExceptions: true,
  });

  return createLogger({
    defaultMeta: {
      label: 'dev',
    },
    format: combine(timestamp(), formatter, align()),
    transports: [consoleTransport, lokiTransport],
  });
};
