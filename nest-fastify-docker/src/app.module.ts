import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as process from 'process';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
