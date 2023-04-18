import { ApiProperty } from '@nestjs/swagger';
import { Fish } from '../../domain/entity/fish';

export class FishRequest extends Fish {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;
}

export type FishesRequest = FishRequest[];
