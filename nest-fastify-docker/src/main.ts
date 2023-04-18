import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { fastifyCsrfProtection } from '@fastify/csrf-protection';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { CatModule } from './cat.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './repository/prisma/prisma.service';
import { sampleMiddleware } from './middleware/prisma/sample';
import otelSDK from './telemetry/telemetry';
import { FishModule } from './fish.module';
import { MessageInterceptorChain } from './producer/interceptor/message.interceptor';
import { RabbitmqProducer } from './producer/rabbitmq/rabbitmq.producer';
import { LoggingInterceptor } from './interceptor/producer/logging.interceptor';

async function bootstrap() {
  /*
  const httpsOptions = {
    key: fsReadFile(__dirname + '../devtools/certfile/localhost.key'),
    cert: fsReadFile(__dirname + '../devtools/certfile/localhost.crt'),
  };
   */

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true, cors: true },
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.register(fastifyCsrfProtection);

  if (process.env.NODE_ENV !== 'production') {
    const catOpenapiConfig = new DocumentBuilder()
      .setTitle('Cats example')
      .setVersion('1.0')
      .addServer('http://localhost:3000')
      .addServer('https://localhost:3000')
      .build();
    const catDoc = SwaggerModule.createDocument(app, catOpenapiConfig, {
      include: [CatModule],
    });
    SwaggerModule.setup('api/cats', app, catDoc);

    const fishOpenapiConfig = new DocumentBuilder()
      .setTitle('Fish example')
      .setVersion('1.0')
      .addServer('http://localhost:3000')
      .addServer('https://localhost:3000')
      .build();
    const fishDoc = SwaggerModule.createDocument(app, fishOpenapiConfig, {
      include: [FishModule],
    });
    SwaggerModule.setup('api/fish', app, fishDoc);
  }

  app.useGlobalPipes(new ValidationPipe());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await prismaService.enableLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await prismaService.enableMiddleware(sampleMiddleware);

  await otelSDK.start();

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
