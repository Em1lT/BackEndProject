const { createLogger, transports, format, addColors,  } = require("winston");

const logger = createLogger({

  transports: [
    new transports.File({
      level: "info",
      filename: "./logs/info.log",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      level: "error",
      filename: "./logs/error.log",
      format: format.combine(
          format.timestamp(), format.json()),
    }),
    new transports.File({
      level: "debug",
      filename: "./logs/debug.log",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green'
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.printf(msg => 
        colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
      )
    ),
    format: format.simple()
  }));
}

module.exports = {
  logger,
}
