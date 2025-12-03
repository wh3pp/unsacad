import { describe, test, expect } from 'bun:test';
import { Option, OptionKind } from './option';
import { UnwrapOptionError } from './errors';

describe('Option', () => {
  describe('type guards', () => {
    test('isSome() identifies Some', () => {
      const opt = Option.some('x');
      expect(Option.isSome(opt)).toBe(true);
      expect(Option.isNone(opt)).toBe(false);
    });

    test('isNone() identifies None', () => {
      const opt = Option.none();
      expect(Option.isSome(opt)).toBe(false);
      expect(Option.isNone(opt)).toBe(true);
    });
  });

  describe('unwrap()', () => {
    test('unwrap(Some) returns value', () => {
      expect(Option.unwrap(Option.some('ok'))).toBe('ok');
    });

    test('unwrap(None) throws', () => {
      expect(() => Option.unwrap(Option.none())).toThrow(UnwrapOptionError);
    });
  });

  describe('unwrapOr()', () => {
    test('Some → returns value', () => {
      expect(Option.unwrapOr(Option.some(10), 0)).toBe(10);
    });

    test('None → returns default', () => {
      expect(Option.unwrapOr(Option.none(), 'fallback')).toBe('fallback');
    });
  });

  describe('unwrapOrElse()', () => {
    test('Some → returns value', () => {
      expect(Option.unwrapOrElse(Option.some(10), () => 0)).toBe(10);
    });

    test('None → calls fallback fn', () => {
      const fallback = Option.unwrapOrElse(Option.none(), () => 'computed');
      expect(fallback).toBe('computed');
    });
  });

  describe('map()', () => {
    test('Some → applies fn(value)', () => {
      const opt = Option.map(Option.some(2), (x: number) => x * 3);
      expect(opt).toEqual({
        kind: OptionKind.Some,
        value: 6,
      });
    });

    test('None → returns None', () => {
      const opt = Option.map(Option.none(), (x) => x);
      expect(opt.kind).toBe(OptionKind.None);
    });
  });

  describe('andThen()', () => {
    test('Some → applies fn returning Option', () => {
      const opt = Option.andThen(Option.some(5), (x) => Option.some(x + 1));
      expect(opt).toEqual({
        kind: OptionKind.Some,
        value: 6,
      });
    });

    test('Some → fn returns None', () => {
      const opt = Option.andThen(Option.some(5), () => Option.none());
      expect(opt.kind).toBe(OptionKind.None);
    });

    test('None → returns None', () => {
      const opt = Option.andThen(Option.none(), (x) => Option.some(x));
      expect(opt.kind).toBe(OptionKind.None);
    });
  });

  describe('match()', () => {
    test('Some → calls some handler', () => {
      const res = Option.match(Option.some('ok'), {
        some: (v) => `value:${v}`,
        none: () => 'none',
      });
      expect(res).toBe('value:ok');
    });

    test('None → calls none handler', () => {
      const res = Option.match(Option.none(), {
        some: () => 'some',
        none: () => 'none',
      });
      expect(res).toBe('none');
    });
  });
});
