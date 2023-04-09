import { Cats } from '../entity/cat';
import { Injectable } from '@nestjs/common';

export interface CatUsecase {
  findAll(): Cats;
}

@Injectable()
export class DefaultCatsUsecase implements CatUsecase {
  private readonly cats: Cats = [];

  findAll(): Cats {
    return this.cats;
  }
}
