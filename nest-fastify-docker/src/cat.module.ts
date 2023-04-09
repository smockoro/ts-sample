import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatController } from './controller/cat.controller';
import { DefaultCatsUsecase } from './domain/usecase/cat.usecase';

@Module({
  imports: [],
  controllers: [CatController],
  providers: [
    {
      provide: 'CAT_USECASE',
      useClass: DefaultCatsUsecase,
    },
  ],
})
export class CatModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer): void {}
}
