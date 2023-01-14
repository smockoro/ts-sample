export class SystemError implements Error {
  private _message: string | undefined
  readonly _name: string = 'SystemError'
  readonly _code: string

  constructor(code: string) {
    this._code = code
  }

  set message(value: string) {
    this._message = value;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }
}

export class BusinessError implements Error {
  private _message: string | undefined
  readonly _name: string = 'BusinessError'
  readonly _code: string

  constructor(code: string) {
    this._code = code
  }

  set message(value: string) {
    this._message = value;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }
}