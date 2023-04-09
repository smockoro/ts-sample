export interface CustomError extends Error {
  code: string;
  message: string;
  target?: Map<string, any>;
  details?: CustomError[];
}
