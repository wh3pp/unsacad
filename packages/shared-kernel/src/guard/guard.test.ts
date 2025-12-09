import { describe, test, expect } from 'bun:test';
import { Guard } from './guard';

describe('Guard', () => {
  describe('isEmpty', () => {
    test('returns true for null or undefined', () => {
      expect(Guard.isEmpty(null)).toBe(true);
      expect(Guard.isEmpty(undefined)).toBe(true);
    });

    test('returns true for empty strings', () => {
      expect(Guard.isEmpty('')).toBe(true);
      expect(Guard.isEmpty('   ')).toBe(true);
    });

    test('returns true for empty arrays', () => {
      expect(Guard.isEmpty([])).toBe(true);
    });

    test('returns false for non-empty values', () => {
      expect(Guard.isEmpty('hi')).toBe(false);
      expect(Guard.isEmpty([1])).toBe(false);
      expect(Guard.isEmpty(0)).toBe(false);
      expect(Guard.isEmpty(false)).toBe(false);
    });
  });

  describe('isShort', () => {
    test('checks short strings and arrays', () => {
      expect(Guard.isShort('hi', 3)).toBe(true);
      expect(Guard.isShort('hey', 3)).toBe(false);
      expect(Guard.isShort([1], 2)).toBe(true);
      expect(Guard.isShort([1, 2], 2)).toBe(false);
    });
  });

  describe('isLong', () => {
    test('checks long strings and arrays', () => {
      expect(Guard.isLong('hello', 3)).toBe(true);
      expect(Guard.isLong('hi', 3)).toBe(false);
      expect(Guard.isLong([1, 2, 3, 4], 3)).toBe(true);
      expect(Guard.isLong([1], 3)).toBe(false);
    });
  });

  describe('isOutOfRange', () => {
    test('detects values outside range', () => {
      expect(Guard.isOutOfRange(0, 1, 10)).toBe(true);
      expect(Guard.isOutOfRange(11, 1, 10)).toBe(true);
    });

    test('returns false for values inside range', () => {
      expect(Guard.isOutOfRange(5, 1, 10)).toBe(false);
      expect(Guard.isOutOfRange(1, 1, 10)).toBe(false);
      expect(Guard.isOutOfRange(10, 1, 10)).toBe(false);
    });
  });
});
