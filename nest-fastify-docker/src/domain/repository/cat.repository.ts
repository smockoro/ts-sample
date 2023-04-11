import { Cats } from '../entity/cat';

export interface CatRepository {
  findAll(): Promise<Cats>;
}
