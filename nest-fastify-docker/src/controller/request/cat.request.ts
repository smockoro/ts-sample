import { Cat } from '../../domain/entity/cat';
import { IsEmail, IsString } from 'class-validator';

export class CatRequest extends Cat {
  @IsString()
  other: string;

  @IsEmail()
  email: string;
}

export type CatsRequest = CatRequest[];
