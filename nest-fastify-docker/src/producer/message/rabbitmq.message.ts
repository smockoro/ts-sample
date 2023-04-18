import { Message } from './message';

export class RabbitMQMessage implements Message {
  body: object;
  headers: Map<string, string>;
}
