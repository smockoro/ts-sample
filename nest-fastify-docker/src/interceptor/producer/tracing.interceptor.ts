import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { MessageInterceptor } from '../../producer/interceptor/message.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Message } from '../../producer/message/message';

@Injectable()
export class TracingInterceptor implements MessageInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async onAck(message: Message): Promise<Message> {
    this.logger.log('tracing interceptor in onAck');
    return message;
  }

  async onSend(message: Message): Promise<Message> {
    this.logger.log('tracing interceptor in onSend');
    return message;
  }
}
