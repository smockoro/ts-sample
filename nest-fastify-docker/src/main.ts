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
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { join } from 'path';

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
    writeFileSync(join(__dirname, '../public', 'cat.yaml'), dump(catDoc, {}));
    writeFileSync(
      join(__dirname, '../public', 'cat.json'),
      JSON.stringify(catDoc, undefined, 2),
    );

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
    writeFileSync(join(__dirname, '../public', 'fish.yaml'), dump(fishDoc, {}));
    writeFileSync(
      join(__dirname, '../public', 'fish.json'),
      JSON.stringify(fishDoc, undefined, 2),
    );
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
