const envToLogger = {
  development: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false
}

const env: string = process.env.NODE_ENV as string || 'development'

// @ts-ignore
export const loggerConfig = envToLogger[env]