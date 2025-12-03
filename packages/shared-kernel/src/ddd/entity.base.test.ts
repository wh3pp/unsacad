import { describe, test, expect } from 'bun:test';
import { Entity } from './entity.base';
import { UniqueEntityID } from './unique-entity-id';

class AddressEntity extends Entity<{ street: string; zip: string }> {
  protected override validate(): void {}
}

class UserEntity extends Entity<{
  name: string;
  createdAt: Date;
  tags: string[];
  address: AddressEntity;
}> {
  protected override validate(): void {}
}

describe('Entity', () => {
  test('creates an entity with auto-generated id', () => {
    const entity = new AddressEntity({ street: 'Main', zip: '12345' });
    expect(entity.id).toBeInstanceOf(UniqueEntityID);
  });

  test('keeps props immutable', () => {
    const entity = new AddressEntity({ street: 'Main', zip: '12345' });

    expect(Object.isFrozen(entity.props)).toBe(true);
    expect(() => {
      // @ts-expect-error should be read-only
      entity.props.street = 'Other';
    }).toThrow();
  });

  test('equals returns true for same instance', () => {
    const entity = new AddressEntity({ street: 'Main', zip: '12345' });
    expect(entity.equals(entity)).toBe(true);
  });

  test('equals returns true for different instances with same ID', () => {
    const id = new UniqueEntityID();

    const a = new AddressEntity({ street: 'Main', zip: '12345' }, id);
    const b = new AddressEntity({ street: 'Main', zip: '12345' }, id);

    expect(a.equals(b)).toBe(true);
  });

  test('equals returns false for entities with different IDs', () => {
    const a = new AddressEntity({ street: 'A', zip: '111' });
    const b = new AddressEntity({ street: 'A', zip: '111' });

    expect(a.equals(b)).toBe(false);
  });

  test('equals handles null and undefined safely', () => {
    const entity = new AddressEntity({ street: 'Main', zip: '123' });

    expect(entity.equals(undefined)).toBe(false);
  });

  test('isEntity returns true for valid Entity', () => {
    const e = new AddressEntity({ street: 'Main', zip: '12345' });
    expect(Entity.isEntity(e)).toBe(true);
  });

  test('isEntity returns false for non-entities', () => {
    expect(Entity.isEntity({})).toBe(false);
    expect(Entity.isEntity(null)).toBe(false);
    expect(Entity.isEntity('test')).toBe(false);
  });

  test('toObject serializes plain props', () => {
    const e = new AddressEntity({ street: 'Main', zip: '12345' });

    const obj = e.toObject();

    expect(obj).toEqual({
      id: e.id.toString(),
      street: 'Main',
      zip: '12345',
    });
  });

  test('toObject serializes Date props to ISO string', () => {
    const date = new Date('2021-05-05T10:20:30.000Z');

    const e = new UserEntity({
      name: 'John',
      createdAt: date,
      tags: [],
      address: new AddressEntity({ street: 'Main', zip: '123' }),
    });

    const raw = e.toObject();

    expect(raw['createdAt']).toBe(date.toISOString());
  });

  test('toObject deeply serializes nested entities', () => {
    const address = new AddressEntity({ street: 'Main', zip: '12345' });

    const user = new UserEntity({
      name: 'John',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      tags: ['admin', 'dev'],
      address,
    });

    const obj = user.toObject();

    expect(obj).toEqual({
      id: user.id.toString(),
      name: 'John',
      createdAt: '2021-01-01T00:00:00.000Z',
      tags: ['admin', 'dev'],
      address: {
        id: address.id.toString(),
        street: 'Main',
        zip: '12345',
      },
    });
  });

  test('toObject serializes arrays recursively', () => {
    const user = new UserEntity({
      name: 'Test',
      createdAt: new Date('2020-01-01'),
      tags: ['a', 'b', 'c'],
      address: new AddressEntity({ street: 'X', zip: '1' }),
    });

    const obj = user.toObject();

    expect(obj['tags']).toEqual(['a', 'b', 'c']);
  });

  test('toObject serializes nested objects that are not Entities', () => {
    class MiscEntity extends Entity<{ meta: { x: number; y: number } }> {}

    const e = new MiscEntity({ meta: { x: 1, y: 2 } });
    const obj = e.toObject();

    expect(obj).toEqual({
      id: e.id.toString(),
      meta: { x: 1, y: 2 },
    });
  });
});
