import { describe, test, expect } from 'bun:test';
import { isBefore, isAfter, addDays, startOfDay } from './date.util';

describe('Date Utils', () => {
  describe('isBefore()', () => {
    test('a < b → true', () => {
      const a = new Date('2020-01-01');
      const b = new Date('2020-01-02');
      expect(isBefore(a, b)).toBe(true);
    });

    test('a > b → false', () => {
      const a = new Date('2020-01-03');
      const b = new Date('2020-01-02');
      expect(isBefore(a, b)).toBe(false);
    });

    test('a == b → false', () => {
      const a = new Date('2020-01-01T00:00:00Z');
      const b = new Date('2020-01-01T00:00:00Z');
      expect(isBefore(a, b)).toBe(false);
    });
  });

  describe('isAfter()', () => {
    test('a > b → true', () => {
      const a = new Date('2020-01-02');
      const b = new Date('2020-01-01');
      expect(isAfter(a, b)).toBe(true);
    });

    test('a < b → false', () => {
      const a = new Date('2020-01-01');
      const b = new Date('2020-01-02');
      expect(isAfter(a, b)).toBe(false);
    });

    test('a == b → false', () => {
      const a = new Date('2020-01-01');
      const b = new Date('2020-01-01');
      expect(isAfter(a, b)).toBe(false);
    });
  });

  describe('addDays()', () => {
    test('adds days', () => {
      const date = new Date('2020-01-01');
      const result = addDays(date, 5);
      expect(result).toEqual(new Date('2020-01-06'));
    });

    test('subtracts days (negative)', () => {
      const date = new Date('2020-01-10');
      const result = addDays(date, -3);
      expect(result).toEqual(new Date('2020-01-07'));
    });

    test('does not mutate original', () => {
      const original = new Date('2020-01-01');
      addDays(original, 1);
      expect(original).toEqual(new Date('2020-01-01'));
    });
  });

  describe('startOfDay()', () => {
    test('resets time to 00:00:00.000', () => {
      const date = new Date('2020-01-01T15:23:45.678Z');
      const result = startOfDay(date);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    test('does not mutate original', () => {
      const original = new Date('2020-01-01T10:00:00.000Z');
      startOfDay(original);
      expect(original).toEqual(new Date('2020-01-01T10:00:00.000Z'));
    });
  });
});
