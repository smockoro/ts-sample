import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class Cat {
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  name: string;

  @IsInt()
  age: number;

  //@IsDateString()
  birthday: string;
}

export type Cats = Cat[];
