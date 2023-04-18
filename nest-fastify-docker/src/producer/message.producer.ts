import { Message } from './message/message';

export interface MessageProducer {
  produce(message: Message): Promise<void>;
}
