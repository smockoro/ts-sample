import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as process from 'process';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { FishController } from './controller/fish.controller';
import { DefaultFishUsecase } from './domain/usecase/fish.usecase';
import { RabbitmqFishProducer } from './producer/fish.producer';
import { RabbitmqProducer } from './producer/rabbitmq/rabbitmq.producer';
import { MessageInterceptorChain } from './producer/interceptor/message.interceptor';
import { LoggingInterceptor } from './interceptor/producer/logging.interceptor';
import { ValidationPipe } from './producer/pipe/producer/validation.pipe';
import {
  MessagePipe,
  MessagePipeChain,
} from './producer/pipe/producer/message.pipe';
import { TracingInterceptor } from './interceptor/producer/tracing.interceptor';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
      exchanges: [],
      channels: {},
    }),
  ],
  controllers: [FishController],
  providers: [
    {
      provide: 'FISH_USECASE',
      useClass: DefaultFishUsecase,
    },
    {
      provide: 'FISH_PRODUCER',
      useClass: RabbitmqFishProducer,
    },
    {
      provide: 'RABBITMQ_PRODUCER',
      useClass: RabbitmqProducer,
    },
    {
      provide: MessageInterceptorChain,
      useFactory: (
        loggingInterceptor: LoggingInterceptor,
        tracingInterceptor: TracingInterceptor,
      ) => {
        return new MessageInterceptorChain(
          tracingInterceptor,
          loggingInterceptor,
        );
      },
      inject: [LoggingInterceptor, TracingInterceptor],
    },
    {
      provide: MessagePipeChain,
      useFactory: (validationPipe: ValidationPipe) => {
        return new MessagePipeChain(validationPipe);
      },
      inject: [ValidationPipe],
    },
    LoggingInterceptor,
    TracingInterceptor,
    ValidationPipe,
  ],
})
export class FishModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer): void {}
}
