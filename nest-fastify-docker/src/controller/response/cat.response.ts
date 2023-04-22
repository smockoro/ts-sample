import { Cat } from '../../domain/entity/cat';
import { ApiProperty } from '@nestjs/swagger';

export class CatResponse extends Cat {
  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  birthday: string;
}

export type CatsResponse = CatResponse[];
