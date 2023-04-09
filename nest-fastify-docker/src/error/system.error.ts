import { CustomError } from './custom.error';

export class SystemError implements CustomError {
  name: string;
  stack?: string;

  code: string;
  message: string;
  target?: Map<string, any>;
  details?: CustomError[];
}
