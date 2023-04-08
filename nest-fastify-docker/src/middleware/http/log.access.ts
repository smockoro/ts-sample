import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RequestContextStorage } from '../../context/request.context';

@Injectable()
export class AccessLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const startTime = Date.now();
    this.logger.log({
      type: 'request',
      requestId: RequestContextStorage.currentContext?.requestId,
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
      sourceIp: req.ip,
    });
    next();
    this.logger.log({
      type: 'response',
      requestId: RequestContextStorage.currentContext?.requestId,
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
      sourceIp: req.ip,
      responseTime: Date.now() - startTime,
    });
  }
}
