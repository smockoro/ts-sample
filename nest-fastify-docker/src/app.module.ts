import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as process from 'process';
import { AccessLoggingMiddleware } from './middleware/http/log.access';
import { RequestContextMiddleware } from './middleware/http/request.context';
import { CatController } from './controller/cat.controller';
import { DefaultCatsUsecase } from './domain/usecase/cat.usecase';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format:
            process.env.NODE_ENV !== 'production'
              ? winston.format.combine(
                  winston.format.timestamp(),
                  nestWinstonModuleUtilities.format.nestLike('SampleApp', {
                    colors: true,
                    prettyPrint: true,
                  }),
                )
              : winston.format.combine(winston.format.timestamp()),
        }),
      ],
    }),
    PrometheusModule.register(),
  ],
  controllers: [AppController, CatController],
  providers: [
    AppService,
    {
      provide: 'CAT_USECASE',
      useClass: DefaultCatsUsecase,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '/v1/*', method: RequestMethod.ALL })
      .apply(AccessLoggingMiddleware)
      .forRoutes({
        path: '/v1/*',
        method: RequestMethod.ALL,
      });
  }
}
