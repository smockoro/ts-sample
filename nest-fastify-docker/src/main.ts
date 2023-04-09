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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true, cors: true },
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.register(fastifyCsrfProtection);

  if (process.env.NODE_ENV !== 'production') {
    const openapiConfig = new DocumentBuilder()
      .setTitle('Cats example')
      .setVersion('1.0')
      .addServer('http://localhost:3000')
      .addServer('https://localhost:3000')
      .build();
    const doc = SwaggerModule.createDocument(app, openapiConfig);
    SwaggerModule.setup('api', app, doc);
  }

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
