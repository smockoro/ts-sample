import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CatResponse, CatsResponse } from './response/cat.response';
import { CatUsecase } from '../domain/usecase/cat.usecase';
import { CatRequest, CatsRequest } from './request/cat.request';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RequestContextStorage } from '../context/request.context';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('cats')
@Controller('v1/cats')
export class CatController {
  constructor(
    @Inject('CAT_USECASE') private readonly usecase: CatUsecase,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'success', type: [CatResponse] })
  @ApiResponse({ status: 400, description: 'bad request' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  async listCats(): Promise<CatsResponse> {
    this.logger.log({
      message: 'sample',
      requestId: RequestContextStorage.currentContext?.requestId,
    });
    return this.usecase.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'success', type: CatResponse })
  async getCatById(@Param() params): Promise<CatResponse> {
    return { name: 'regu', age: 1, birthday: '2019/9/14' };
  }

  @Post()
  @ApiBody({ type: [CatRequest] })
  @ApiResponse({ status: 201, description: 'created', type: [CatResponse] })
  async createCats(@Body() body: CatsRequest): Promise<CatsResponse> {
    return this.usecase.findAll();
  }

  @Put()
  @ApiBody({ type: [CatRequest] })
  @ApiResponse({ status: 200, description: 'success', type: [CatResponse] })
  async updateCats(@Body() body: CatsRequest): Promise<CatsResponse> {
    return this.usecase.findAll();
  }

  @Delete()
  async deleteCats(@Param() params): Promise<void> {
    this.usecase.findAll();
    return;
  }
}
