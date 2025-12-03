import { describe, test, expect } from 'bun:test';
import { UniqueEntityID } from './unique-entity-id';

describe('UniqueEntityID', () => {
  describe('constructor', () => {
    test('creates a new random UUID when no id is provided', () => {
      const id1 = new UniqueEntityID();
      const id2 = new UniqueEntityID();

      expect(id1.toString()).not.toBe(id2.toString()); // unique
    });

    test('uses provided id', () => {
      const id = new UniqueEntityID('abc-123');
      expect(id.toString()).toBe('abc-123');
    });
  });

  describe('string/value accessors', () => {
    test('toString() returns internal value', () => {
      const id = new UniqueEntityID('test-123');
      expect(id.toString()).toBe('test-123');
    });

    test('toValue() returns internal value', () => {
      const id = new UniqueEntityID('xyz-789');
      expect(id.toValue()).toBe('xyz-789');
    });
  });

  describe('equals()', () => {
    test('same id instance → true', () => {
      const id1 = new UniqueEntityID('same');
      const id2 = new UniqueEntityID('same');

      expect(id1.equals(id2)).toBe(true);
    });

    test('different ids → false', () => {
      const id1 = new UniqueEntityID('a');
      const id2 = new UniqueEntityID('b');

      expect(id1.equals(id2)).toBe(false);
    });

    test('undefined → false', () => {
      const id = new UniqueEntityID('x');
      expect(id.equals(undefined)).toBe(false);
    });

    test('non-UniqueEntityID object → false', () => {
      const id = new UniqueEntityID('x');
      expect(id.equals({} as UniqueEntityID)).toBe(false);
    });

    test('same reference → true', () => {
      const id = new UniqueEntityID('same');
      expect(id.equals(id)).toBe(true);
    });
  });
});
