import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { RequestContextStorage } from '../../context/request.context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    RequestContextStorage.storage.run(
      new RequestContextStorage(req, res),
      async () => {
        next();
      },
    );
  }
}
