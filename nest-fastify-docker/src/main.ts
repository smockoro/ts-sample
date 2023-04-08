import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { fastifyCsrfProtection } from '@fastify/csrf-protection';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true, cors: true },
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.register(fastifyCsrfProtection);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
