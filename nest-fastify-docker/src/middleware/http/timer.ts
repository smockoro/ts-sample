import { NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export class TimerMiddleware implements NestMiddleware {
  private delay: number;
  private readonly timerHeaderName = 'x-timer-sleep';

  use(req: FastifyRequest, res: FastifyReply, next: () => void): void {
    if (req.headers[this.timerHeaderName] != null) {
      this.delay = Number(req.headers[this.timerHeaderName]);
      this.sleep();
    }
    next();
  }

  sleep() {
    const stop = new Date().getTime();
    while (new Date().getTime() < stop + this.delay) {}
  }
}
