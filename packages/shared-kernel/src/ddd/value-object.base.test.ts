import { describe, test, expect } from 'bun:test';
import { ValueObject, type DomainPrimitive } from './value-object.base';
import { ArgumentNotProvidedException } from '../exceptions';

class NameVO extends ValueObject<string> {
  protected validate(props: DomainPrimitive<string>): void {
    if (props.value.trim().length < 2) {
      throw new Error('Name must be at least 2 chars');
    }
  }
}

class ProfileVO extends ValueObject<{ name: NameVO; tags: NameVO[] }> {
  protected validate(): void {}
}

describe('ValueObject', () => {
  test('creates a valid primitive VO', () => {
    const vo = new NameVO({ value: 'John' });
    expect(vo.unpack()).toBe('John');
  });

  test('throws when primitive value is empty', () => {
    expect(() => new NameVO({ value: '' })).toThrow(ArgumentNotProvidedException);
  });

  test('throws when domain rule is violated', () => {
    expect(() => new NameVO({ value: 'A' })).toThrow('Name must be at least 2 chars');
  });

  test('unpacks primitive VO', () => {
    const vo = new NameVO({ value: 'Lucas' });
    expect(vo.unpack()).toBe('Lucas');
  });

  test('unpacks nested VO structure', () => {
    const profile = new ProfileVO({
      name: new NameVO({ value: 'John' }),
      tags: [new NameVO({ value: 'Dev' }), new NameVO({ value: 'Admin' })],
    });

    const raw = profile.unpack() as unknown as {
      name: string;
      tags: string[];
    };

    expect(raw).toEqual({ name: 'John', tags: ['Dev', 'Admin'] });
  });

  test('unpacked result is frozen', () => {
    const profile = new ProfileVO({
      name: new NameVO({ value: 'John' }),
      tags: [],
    });

    const raw = profile.unpack() as unknown;

    expect(Object.isFrozen(raw)).toBe(true);
  });

  test('equals returns true for same instance', () => {
    const vo = new NameVO({ value: 'John' });
    expect(vo.equals(vo)).toBe(true);
  });

  test('equals returns true for structurally equal VOs', () => {
    const a = new NameVO({ value: 'John' });
    const b = new NameVO({ value: 'John' });
    expect(a.equals(b)).toBe(true);
  });

  test('equals returns false for different values', () => {
    const a = new NameVO({ value: 'John' });
    const b = new NameVO({ value: 'Jane' });
    expect(a.equals(b)).toBe(false);
  });

  test('equals handles null and undefined', () => {
    const vo = new NameVO({ value: 'XX' });
    expect(vo.equals(null as unknown as ValueObject<string> | null)).toBe(false);
    expect(vo.equals(undefined as unknown as ValueObject<string> | undefined)).toBe(false);
  });

  test('isValueObject returns true for VO', () => {
    const vo = new NameVO({ value: 'John' });
    expect(ValueObject.isValueObject(vo)).toBe(true);
  });

  test('isValueObject returns false for non-VO', () => {
    expect(ValueObject.isValueObject({})).toBe(false);
    expect(ValueObject.isValueObject(null)).toBe(false);
    expect(ValueObject.isValueObject('test')).toBe(false);
  });
});
