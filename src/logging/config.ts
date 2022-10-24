import { LoggerOptions } from "pino";

const pinoConfig: LoggerOptions =
  process.env.NODE_ENV === 'production' ?
    {
      messageKey: 'message',
      errorKey: 'error',
      formatters: {
        level: (label) => {
          return { level: label }
        }
      },
    } : {
      messageKey: 'message',
      errorKey: 'error',
      formatters: {
        level: (label) => {
          return { level: label }
        }
      },
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    }

export default pinoConfig