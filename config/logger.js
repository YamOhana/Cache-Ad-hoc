const winston = require('winston');

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
};

winston.addColors(colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYY HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
