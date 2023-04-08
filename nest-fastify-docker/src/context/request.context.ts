import { AsyncLocalStorage } from 'async_hooks';
import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidV4 } from 'uuid';

export class RequestContextStorage {
  static storage = new AsyncLocalStorage<RequestContextStorage>();
  requestId: string;

  static get currentContext(): any {
    return this.storage.getStore();
  }

  constructor(
    public readonly req: FastifyRequest,
    public readonly res: FastifyReply,
  ) {
    this.requestId = uuidV4();
  }
}
