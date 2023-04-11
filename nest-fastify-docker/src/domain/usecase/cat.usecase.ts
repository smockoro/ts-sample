import { Cats } from '../entity/cat';
import { Inject, Injectable } from '@nestjs/common';
import { CatRepository } from '../repository/cat.repository';

export interface CatUsecase {
  findAll(): Promise<Cats>;
}

@Injectable()
export class DefaultCatsUsecase implements CatUsecase {
  private readonly cats: Cats = [];
  constructor(@Inject('CAT_REPOSITORY') private readonly repo: CatRepository) {}

  findAll(): Promise<Cats> {
    return this.repo.findAll();
  }
}
