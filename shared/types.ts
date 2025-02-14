export class Ok<T> {
  constructor(readonly value: T) {}
  isOk(): this is Ok<T> {
    return true;
  }
  isErr(): this is Err {
    return false;
  }
  unwrap(): T {
    return this.value;
  }
}

export class Err {
  constructor(readonly error: string) {}
  isOk(): this is Ok<any> {
    return false;
  }
  isErr(): this is Err {
    return true;
  }
  unwrap(): never {
    throw new Error(`Cannot unwrap err: ${this.error}`);
  }
}

export type Result<T> = Ok<T> | Err;

export type Grid = number[][];
