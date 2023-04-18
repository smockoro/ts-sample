import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CatResponse, CatsResponse } from './response/cat.response';
import { CatUsecase } from '../domain/usecase/cat.usecase';
import { CatsRequest } from './request/cat.request';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RequestContextStorage } from '../context/request.context';

@Controller('v1/cats')
export class CatController {
  constructor(
    @Inject('CAT_USECASE') private readonly usecase: CatUsecase,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  async listCats(): Promise<CatsResponse> {
    this.logger.log({
      message: 'sample',
      requestId: RequestContextStorage.currentContext?.requestId,
    });
    return this.usecase.findAll();
  }

  @Get(':id')
  async getCatById(@Param() params): Promise<CatResponse> {
    return { name: 'regu', age: 1, birthday: '2019/9/14' };
  }

  @Post()
  async createCats(@Body() body: CatsRequest): Promise<CatsResponse> {
    return this.usecase.findAll();
  }

  @Put()
  async updateCats(@Body() body: CatsRequest): Promise<CatsResponse> {
    return this.usecase.findAll();
  }
}
