import { describe, test, expect } from 'bun:test';
import { UniqueEntityID } from './unique-entity-id';
import { ArgumentInvalidException } from '../exceptions/validation.exceptions';
import type { Err } from '../functional/result';

describe('UniqueEntityID', () => {
  test('generate() creates a valid UUID', () => {
    const id = UniqueEntityID.generate();
    expect(typeof id.toString()).toBe('string');
    expect(id.toString().length).toBeGreaterThan(0);
  });

  test('create() returns Ok when ID is valid', () => {
    const result = UniqueEntityID.create('abc-123');
    expect(result.isOk()).toBe(true);
    expect(result.unwrap().toValue()).toBe('abc-123');
  });

  test('create() returns Err when ID is empty', () => {
    const result = UniqueEntityID.create('  ');
    expect(result.isErr()).toBe(true);

    const error = (result as Err<UniqueEntityID, ArgumentInvalidException>).error;
    expect(error).toBeInstanceOf(ArgumentInvalidException);
  });

  test('toString() returns raw value', () => {
    const id = UniqueEntityID.create('xyz').unwrap();
    expect(id.toString()).toBe('xyz');
  });

  test('toValue() returns raw value', () => {
    const id = UniqueEntityID.create('123').unwrap();
    expect(id.toValue()).toBe('123');
  });
});
