import { MessageInterceptor } from '../../producer/interceptor/message.interceptor';
import { Message } from '../../producer/message/message';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggingInterceptor implements MessageInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  async onSend(message: Message): Promise<Message> {
    this.logger.log('logging interceptor in onSend');
    return message;
  }

  async onAck(message: Message): Promise<Message> {
    this.logger.log('logging interceptor in onAck');
    return message;
  }
}
