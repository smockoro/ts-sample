import { Cat } from '../../domain/entity/cat';

export type CatRequest = Cat & {
  other: string;
};

export type CatsRequest = CatRequest[];
