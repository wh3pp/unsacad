import { describe, test, expect } from 'bun:test';
import { ValueObject } from './value-object.base';
import { Result } from '../functional/result';

class StringVO extends ValueObject<string> {
  static create(value: string) {
    return Result.ok(new StringVO({ value }));
  }
}

interface AddressProps {
  street: string;
  zip: string;
}

class AddressVO extends ValueObject<AddressProps> {
  static create(props: AddressProps) {
    return Result.ok(new AddressVO(props));
  }
}

class UserProfileVO extends ValueObject<{
  name: string;
  address: AddressVO;
  tags: StringVO[];
}> {
  static create(v: { name: string; address: AddressVO; tags: StringVO[] }) {
    return Result.ok(new UserProfileVO(v));
  }
}

describe('ValueObject Base Class', () => {
  test('isValueObject() correctly identifies ValueObject instances', () => {
    const ok = StringVO.create('hello').unwrap();
    const notVO = { value: 'x' };

    expect(ValueObject.isValueObject(ok)).toBe(true);
    expect(ValueObject.isValueObject(notVO)).toBe(false);
    expect(ValueObject.isValueObject(null)).toBe(false);
  });

  test('unpack() returns primitive for DomainPrimitive<T>', () => {
    const vo = StringVO.create('Hello').unwrap();
    const raw = vo.unpack();

    expect(raw as string).toBe('Hello');
  });

  test('unpack() unwraps nested VOs recursively', () => {
    const address = AddressVO.create({ street: 'Main', zip: '12345' }).unwrap();

    const profile = UserProfileVO.create({
      name: 'Alice',
      address,
      tags: [StringVO.create('admin').unwrap(), StringVO.create('staff').unwrap()],
    }).unwrap();

    const raw = profile.unpack();
    const expected = {
      name: 'Alice',
      address: { street: 'Main', zip: '12345' },
      tags: ['admin', 'staff'],
    };

    expect(raw as typeof expected).toEqual(expected);
  });

  test('unpack() unwraps arrays of VOs', () => {
    const address = AddressVO.create({ street: 'A', zip: '000' }).unwrap();

    const profile = UserProfileVO.create({
      name: 'Test',
      address,
      tags: [StringVO.create('x').unwrap(), StringVO.create('y').unwrap()],
    }).unwrap();

    const raw = profile.unpack();

    const expected = {
      name: 'Test',
      address: { street: 'A', zip: '000' },
      tags: ['x', 'y'],
    };

    expect(raw as typeof expected).toEqual(expected);
  });

  test('unpack() deeply unwraps complex nested structures', () => {
    const profile = UserProfileVO.create({
      name: 'Bob',
      address: AddressVO.create({ street: 'Deep', zip: '99999' }).unwrap(),
      tags: [StringVO.create('one').unwrap(), StringVO.create('two').unwrap()],
    }).unwrap();

    const raw = profile.unpack();

    const expected = {
      name: 'Bob',
      address: { street: 'Deep', zip: '99999' },
      tags: ['one', 'two'],
    };

    expect(raw as typeof expected).toEqual(expected);
  });

  test('equals() returns true for identical properties', () => {
    const a = AddressVO.create({ street: 'A', zip: '1' }).unwrap();
    const b = AddressVO.create({ street: 'A', zip: '1' }).unwrap();

    expect(a.equals(b)).toBe(true);
  });

  test('equals() returns false for different properties', () => {
    const a = AddressVO.create({ street: 'A', zip: '1' }).unwrap();
    const b = AddressVO.create({ street: 'B', zip: '1' }).unwrap();

    expect(a.equals(b)).toBe(false);
  });

  test('equals() handles null and undefined', () => {
    const a = AddressVO.create({ street: 'A', zip: '1' }).unwrap();

    expect(a.equals(null)).toBe(false);
    expect(a.equals(undefined)).toBe(false);
  });

  test('equals() returns true when comparing itself', () => {
    const a = AddressVO.create({ street: 'Self', zip: '000' }).unwrap();
    expect(a.equals(a)).toBe(true);
  });

  test('unpack() result is frozen (immutable)', () => {
    const vo = AddressVO.create({ street: 'X', zip: 'YYY' }).unwrap();
    const raw = vo.unpack() as { street: string; zip: string };

    expect(Object.isFrozen(raw)).toBe(true);

    expect(() => {
      raw.street = 'NewStreet';
    }).toThrow();
  });
  describe('ValueObject constructor & value getter', () => {
    class SimpleVO extends ValueObject<string> {
      static create(v: string) {
        return new SimpleVO({ value: v });
      }
    }

    test('constructor freezes props', () => {
      const vo = SimpleVO.create('hello');
      const internal = (vo as unknown as { props: unknown }).props;
      expect(Object.isFrozen(internal)).toBe(true);
    });

    test('value getter returns result of unpack()', () => {
      const vo = SimpleVO.create('world');
      expect(vo.value).toBe(vo.unpack());
    });
  });
});
