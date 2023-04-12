import { RequestContextStorage } from '../../context/request.context';
import { Prisma } from '@prisma/client';

export const sampleMiddleware: Prisma.Middleware = async (params, next) => {
  // https://github.com/prisma/prisma/discussions/12829
  // PrismaのミドルウェアではSQLログを出すのはできない。

  console.log(RequestContextStorage.currentContext?.requestId);
  if (params.action == 'create') {
    console.log('createdAt');
  }
  return next(params);
};
