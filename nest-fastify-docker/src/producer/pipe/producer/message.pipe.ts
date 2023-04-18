import { Message } from '../../message/message';
import { Injectable } from '@nestjs/common';

export interface MessagePipe {
  process(message: Message): Promise<Message | null>;
}

@Injectable()
export class MessagePipeChain {
  private readonly pipes: MessagePipe[] = [];
  constructor(...pipes: MessagePipe[]) {
    this.pipes = pipes;
  }

  async process(message: Message): Promise<Message | null> {
    for (const pipe of this.pipes) {
      const result = await pipe.process(message);
      if (result) {
        return result;
      }
    }
    return null;
  }
}
