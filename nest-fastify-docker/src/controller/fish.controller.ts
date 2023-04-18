import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { FishUsecase } from '../domain/usecase/fish.usecase';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FishRequest } from './request/fish.request';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('fish')
@Controller('v1/fish')
export class FishController {
  constructor(
    @Inject('FISH_USECASE') private readonly usecase: FishUsecase,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'created' })
  @ApiResponse({ status: 400, description: 'bad request' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  async createFish(@Body() body: FishRequest) {
    this.logger.log('create fish message to rabbitmq');
    await this.usecase.publishFish(body);
    this.logger.log('fish message published');
  }
}
