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
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CatModule } from './cat.module';

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
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
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
