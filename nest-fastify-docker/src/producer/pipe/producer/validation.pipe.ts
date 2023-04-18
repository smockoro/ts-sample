import { MessagePipe } from './message.pipe';
import { Message } from '../../message/message';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject, Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements MessagePipe {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  process(message: Message): Promise<Message | null> {
    this.logger.log('in validation pipe');
    return;
  }
}
