import {
  INestApplication,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime';

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'>
  implements OnModuleInit
{
  constructor() {
    super({ log: ['query', 'info', 'warn', 'error'] });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  // https://github.com/prisma/prisma/issues/13126
  // ログに標準でRequestContextから値を入れるのは難しそう…今後のアプデで対応する。
  async enableLogger(logger: LoggerService) {
    this.$on('query', (event) => {
      logger.log({
        query: event.query,
        params: event.params,
        duration: event.duration,
        target: event.target,
        type: 'database',
      });
    });
    this.$on('info', (event) => {
      logger.log({
        target: event.target,
        message: event.message,
        type: 'database',
      });
    });
    this.$on('warn', (event) => {
      logger.warn({
        target: event.target,
        message: event.message,
        type: 'database',
      });
    });
    this.$on('error', (event) => {
      logger.error({
        target: event.target,
        message: event.message,
        type: 'database',
      });
    });
  }

  async enableMiddleware(...params: Prisma.Middleware[]) {
    params.forEach((middleware) => {
      this.$use(middleware);
    });
  }
}
