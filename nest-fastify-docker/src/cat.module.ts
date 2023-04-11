import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatController } from './controller/cat.controller';
import { DefaultCatsUsecase } from './domain/usecase/cat.usecase';
import { SqliteCatRepository } from './repository/sqlite.cat.repository';
import { PrismaService } from './repository/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CatController],
  providers: [
    {
      provide: 'CAT_USECASE',
      useClass: DefaultCatsUsecase,
    },
    {
      provide: 'CAT_REPOSITORY',
      useClass: SqliteCatRepository,
    },
    PrismaService,
  ],
})
export class CatModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer): void {}
}
