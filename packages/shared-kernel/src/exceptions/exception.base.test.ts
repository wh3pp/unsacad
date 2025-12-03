import { describe, test, expect } from 'bun:test';
import { ExceptionBase } from './exception.base';

class MyException extends ExceptionBase {
  override readonly name = 'MyException';
}

describe('ExceptionBase', () => {
  test('sets message correctly', () => {
    const err = new MyException('Something failed');
    expect(err.message).toBe('Something failed');
  });

  test('sets name correctly from subclass', () => {
    const err = new MyException('Oops');
    expect(err.name).toBe('MyException');
  });

  test('captures cause when provided', () => {
    const cause = new Error('inner');
    const err = new MyException('outer', { cause });

    expect(err.cause).toBe(cause);
  });

  test('captures metadata when provided', () => {
    const metadata = { userId: 10, action: 'delete' };
    const err = new MyException('Failed', { metadata });

    expect(err.metadata).toEqual(metadata);
  });

  test('stack is defined', () => {
    const err = new MyException('boom');
    expect(err.stack).toBeDefined();
    expect(typeof err.stack).toBe('string');
  });

  test('toJSON formats correctly', () => {
    const cause = new Error('inner');
    const metadata = { a: 1 };

    const err = new MyException('msg', { cause, metadata });
    const json = err.toJSON();

    expect(json).toEqual({
      message: 'msg',
      code: 'MyException',
      stack: err.stack,
      cause,
      metadata,
    });
  });

  test('instanceof works (prototype chain intact)', () => {
    const err = new MyException('boom');
    expect(err instanceof MyException).toBe(true);
    expect(err instanceof ExceptionBase).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test('cause and metadata default to undefined', () => {
    const err = new MyException('boom');
    expect(err.cause).toBeUndefined();
    expect(err.metadata).toBeUndefined();
  });
});
