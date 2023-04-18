import { MessageProducer } from '../message.producer';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessagePipeChain } from '../pipe/producer/message.pipe';
import { MessageInterceptorChain } from '../interceptor/message.interceptor';
import { Message } from '../message/message';

@Injectable()
export class RabbitmqProducer implements MessageProducer {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly conn: AmqpConnection,
    private readonly chain: MessageInterceptorChain,
    private readonly pipeChain: MessagePipeChain,
  ) {}
  async produce(message: Message): Promise<void> {
    message = await this.pipeChain.process(message);

    await this.chain.onSend(message);

    this.logger.log({
      message: 'message producer',
      sendMessage: message,
    });
    // this.conn.publish('exchange', 'key', message);

    await this.chain.onAck(message);

    return;
  }
}
