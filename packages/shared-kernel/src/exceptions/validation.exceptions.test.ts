import { describe, test, expect } from 'bun:test';

import {
  ArgumentNotProvidedException,
  ArgumentInvalidException,
  NotFoundException,
} from './validation.exceptions';
import { ExceptionBase } from './exception.base';

describe('ArgumentNotProvidedException', () => {
  test('sets correct name', () => {
    const err = new ArgumentNotProvidedException('Missing value');
    expect(err.name).toBe('ArgumentNotProvidedException');
  });

  test('inherits from ExceptionBase and Error', () => {
    const err = new ArgumentNotProvidedException('Missing');
    expect(err instanceof ArgumentNotProvidedException).toBe(true);
    expect(err instanceof ExceptionBase).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test('propagates message, cause, and metadata', () => {
    const cause = new Error('root cause');
    const metadata = { field: 'email' };

    const err = new ArgumentNotProvidedException('Missing', {
      cause,
      metadata,
    });

    expect(err.message).toBe('Missing');
    expect(err.cause).toBe(cause);
    expect(err.metadata).toEqual(metadata);
  });

  test('toJSON is correct', () => {
    const err = new ArgumentNotProvidedException('Invalid');
    const json = err.toJSON();

    expect(json.code).toBe('ArgumentNotProvidedException');
    expect(json.message).toBe('Invalid');
    expect(json.stack).toBe(err.stack);
  });
});

describe('ArgumentInvalidException', () => {
  test('sets correct name', () => {
    const err = new ArgumentInvalidException('Bad format');
    expect(err.name).toBe('ArgumentInvalidException');
  });

  test('inherits from ExceptionBase and Error', () => {
    const err = new ArgumentInvalidException('Bad');
    expect(err instanceof ArgumentInvalidException).toBe(true);
    expect(err instanceof ExceptionBase).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test('propagates message, cause and metadata', () => {
    const cause = new Error('root');
    const metadata = { field: 'age' };

    const err = new ArgumentInvalidException('Bad', {
      cause,
      metadata,
    });

    expect(err.message).toBe('Bad');
    expect(err.cause).toBe(cause);
    expect(err.metadata).toEqual(metadata);
  });

  test('toJSON is correct', () => {
    const err = new ArgumentInvalidException('Invalid');
    const json = err.toJSON();

    expect(json.code).toBe('ArgumentInvalidException');
    expect(json.message).toBe('Invalid');
    expect(json.stack).toBe(err.stack);
  });
});

describe('NotFoundException', () => {
  test('sets correct name', () => {
    const err = new NotFoundException('User not found');
    expect(err.name).toBe('NotFoundException');
  });

  test('inherits from ExceptionBase and Error', () => {
    const err = new NotFoundException('Missing');
    expect(err instanceof NotFoundException).toBe(true);
    expect(err instanceof ExceptionBase).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test('propagates message, cause, and metadata', () => {
    const cause = new Error('root');
    const metadata = { id: '123' };

    const err = new NotFoundException('Missing', {
      cause,
      metadata,
    });

    expect(err.message).toBe('Missing');
    expect(err.cause).toBe(cause);
    expect(err.metadata).toEqual(metadata);
  });

  test('toJSON is correct', () => {
    const err = new NotFoundException('Not found');
    const json = err.toJSON();

    expect(json.code).toBe('NotFoundException');
    expect(json.message).toBe('Not found');
    expect(json.stack).toBe(err.stack);
  });
});
