import { describe, test, expect } from 'bun:test';
import { DateUtil } from './date.util';

describe('DateUtil', () => {
  test('now() returns a Date instance', () => {
    const result = DateUtil.now();
    expect(result).toBeInstanceOf(Date);
  });

  test('nowISO() returns a valid ISO timestamp', () => {
    const iso = DateUtil.nowISO();
    expect(typeof iso).toBe('string');
    expect(() => new Date(iso)).not.toThrow();
  });

  test('isBefore() compares dates correctly', () => {
    const a = new Date('2020-01-01');
    const b = new Date('2020-01-02');

    expect(DateUtil.isBefore(a, b)).toBe(true);
    expect(DateUtil.isBefore(b, a)).toBe(false);
  });

  test('isAfter() compares dates correctly', () => {
    const a = new Date('2020-01-01');
    const b = new Date('2020-01-02');

    expect(DateUtil.isAfter(b, a)).toBe(true);
    expect(DateUtil.isAfter(a, b)).toBe(false);
  });

  test('addDays() returns a new Date without mutating original', () => {
    const date = new Date('2020-01-01T00:00:00.000Z');

    const updated = DateUtil.addDays(date, 5);

    expect(updated).not.toBe(date);
    expect(updated.toISOString()).toBe('2020-01-06T00:00:00.000Z');
    expect(date.toISOString()).toBe('2020-01-01T00:00:00.000Z');
  });

  test('startOfDay() resets time to local 00:00:00.000', () => {
    const date = new Date();
    const result = DateUtil.startOfDay(date);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  test('startOfUTCDay() resets time to UTC 00:00:00.000', () => {
    const date = new Date('2020-01-02T15:45:30.500Z');

    const result = DateUtil.startOfUTCDay(date);

    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
    expect(result.getUTCMilliseconds()).toBe(0);

    expect(result.toISOString()).toBe('2020-01-02T00:00:00.000Z');
  });
});
