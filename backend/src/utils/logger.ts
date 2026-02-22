import winston from 'winston'

const { combine, timestamp, json, colorize, printf } = winston.format

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
    return `${timestamp} [${level}] ${message}${metaStr}`
  })
)

const prodFormat = combine(timestamp(), json())

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), json()),
    }),
  ],
})
