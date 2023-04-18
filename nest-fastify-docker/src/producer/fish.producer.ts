import { FishProducer } from '../domain/producer/fish.producer';
import { Inject, Injectable } from '@nestjs/common';
import { MessageProducer } from './message.producer';
import { Message } from './message/message';

@Injectable()
export class RabbitmqFishProducer implements FishProducer {
  constructor(
    @Inject('RABBITMQ_PRODUCER') private readonly producer: MessageProducer,
  ) {}

  async produceMessage(message: string): Promise<string> {
    const m: Message = {
      headers: new Map<string, string>().set('type', 'sample'),
      body: {
        data: message,
      },
    };
    await this.producer.produce(m);
    return 'ok';
  }
}
