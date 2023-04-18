import { Message } from '../message/message';
import { Injectable } from '@nestjs/common';

export interface MessageInterceptor {
  onSend(message: Message): Promise<Message>;
  onAck(message: Message): Promise<Message>;
}

@Injectable()
export class MessageInterceptorChain {
  private readonly interceptors: MessageInterceptor[] = [];

  constructor(...interceptors: MessageInterceptor[]) {
    this.interceptors = interceptors;
  }

  addInterceptor(interceptor: MessageInterceptor): void {
    this.interceptors.push(interceptor);
  }

  async onSend(message: Message): Promise<Message> {
    let result = message;
    for (const interceptor of this.interceptors) {
      result = await interceptor.onSend(result);
    }
    return result;
  }

  async onAck(message: Message): Promise<Message> {
    let result = message;
    for (const interceptor of this.interceptors.reverse()) {
      result = await interceptor.onAck(result);
    }
    return result;
  }
}
