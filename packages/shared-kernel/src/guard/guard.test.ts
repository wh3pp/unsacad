import { describe, test, expect } from 'bun:test';
import { Guard } from './guard';
import { ArgumentInvalidException, ArgumentNotProvidedException } from '../exceptions';

describe('Guard', () => {
  describe('isEmpty()', () => {
    test('nullish → true', () => {
      expect(Guard.isEmpty(null)).toBe(true);
      expect(Guard.isEmpty(undefined)).toBe(true);
    });

    test('empty or blank string → true', () => {
      expect(Guard.isEmpty('')).toBe(true);
      expect(Guard.isEmpty('   ')).toBe(true);
    });

    test('non-empty string → false', () => {
      expect(Guard.isEmpty('hello')).toBe(false);
    });

    test('empty array → true', () => {
      expect(Guard.isEmpty([])).toBe(true);
    });

    test('non-empty array → false', () => {
      expect(Guard.isEmpty([1])).toBe(false);
    });

    test('Date instance → false', () => {
      expect(Guard.isEmpty(new Date())).toBe(false);
    });

    test('empty Map / Set → true', () => {
      expect(Guard.isEmpty(new Map())).toBe(true);
      expect(Guard.isEmpty(new Set())).toBe(true);
    });

    test('non-empty Map / Set → false', () => {
      const map = new Map([['a', 1]]);
      const set = new Set([1]);

      expect(Guard.isEmpty(map)).toBe(false);
      expect(Guard.isEmpty(set)).toBe(false);
    });

    test('empty object → true', () => {
      expect(Guard.isEmpty({})).toBe(true);
    });

    test('non-empty object → false', () => {
      expect(Guard.isEmpty({ a: 1 })).toBe(false);
    });

    test('object with only empty values → true', () => {
      expect(Guard.isEmpty({ a: undefined })).toBe(true);
      expect(Guard.isEmpty({ a: null })).toBe(true);
      expect(Guard.isEmpty({ a: '' })).toBe(true);
    });

    test('object with at least one non-empty value → false', () => {
      expect(Guard.isEmpty({ a: undefined, b: 10 })).toBe(false);
      expect(Guard.isEmpty({ a: '', b: 'hello' })).toBe(false);
    });

    test('primitives/not objects → false', () => {
      expect(Guard.isEmpty(0)).toBe(false);
      expect(Guard.isEmpty(false)).toBe(false);
      expect(Guard.isEmpty(123)).toBe(false);
      expect(Guard.isEmpty(() => {})).toBe(false);
      expect(Guard.isEmpty(Symbol('x'))).toBe(false);
      expect(Guard.isEmpty(BigInt(10))).toBe(false);
    });
  });

  describe('againstNullOrUndefined()', () => {
    test('nullish → throws', () => {
      expect(() => Guard.againstNullOrUndefined(null, 'x')).toThrow(ArgumentNotProvidedException);

      expect(() => Guard.againstNullOrUndefined(undefined, 'y')).toThrow(
        ArgumentNotProvidedException,
      );
    });

    test('valid values → ok', () => {
      expect(() => Guard.againstNullOrUndefined(0, 'x')).not.toThrow();
      expect(() => Guard.againstNullOrUndefined(false, 'x')).not.toThrow();
      expect(() => Guard.againstNullOrUndefined('a', 'x')).not.toThrow();
    });
  });

  describe('againstEmpty()', () => {
    test('empty → throws', () => {
      const emptyValues = [null, undefined, '', '   ', [], {}, { a: undefined }];

      for (const v of emptyValues) {
        expect(() => Guard.againstEmpty(v, 'prop')).toThrow(ArgumentInvalidException);
      }
    });

    test('non-empty → ok', () => {
      const validValues = ['a', [1], { a: 1 }, new Date(), new Map([['a', 1]]), new Set([1])];

      for (const v of validValues) {
        expect(() => Guard.againstEmpty(v, 'prop')).not.toThrow();
      }
    });
  });
});
