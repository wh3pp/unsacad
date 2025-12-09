import { describe, test, expect } from 'bun:test';
import { Entity } from './entity.base';
import { UniqueEntityID } from './unique-entity-id';
import type { EntityProps, Serializable } from './entity.base';

interface Props extends EntityProps {
  name: string;
  age: number;
  tags?: string[];
  child?: Serializable;
}

class UserEntity extends Entity<Props> {
  static create(props: Props, id?: UniqueEntityID) {
    return new UserEntity(props, id);
  }
}

describe('Entity', () => {
  test('creates entity with generated ID when none provided', () => {
    const user = UserEntity.create({ name: 'A', age: 20 });
    expect(user.id).toBeInstanceOf(UniqueEntityID);
  });

  test('uses provided ID when supplied', () => {
    const id = UniqueEntityID.generate();
    const user = UserEntity.create({ name: 'A', age: 20 }, id);
    expect(user.id.toString()).toBe(id.toString());
  });

  test('props are frozen', () => {
    const user = UserEntity.create({ name: 'A', age: 20 });
    expect(Object.isFrozen(user.props)).toBe(true);
  });

  test('equals() compares by ID', () => {
    const id = UniqueEntityID.generate();
    const u1 = UserEntity.create({ name: 'A', age: 20 }, id);
    const u2 = UserEntity.create({ name: 'B', age: 30 }, id);

    expect(u1.equals(u2)).toBe(true);
  });

  test('equals() returns false for different IDs', () => {
    const u1 = UserEntity.create({ name: 'A', age: 20 });
    const u2 = UserEntity.create({ name: 'A', age: 20 });

    expect(u1.equals(u2)).toBe(false);
  });

  test('toObject() serializes primitive and array props', () => {
    const user = UserEntity.create({
      name: 'A',
      age: 20,
      tags: ['x', 'y'],
    });

    const obj = user.toObject();

    expect(obj['id']).toBe(user.id.toString());
    expect(obj['name']).toBe('A');
    expect(obj['tags']).toEqual(['x', 'y']);
  });

  test('nested serializable objects are converted properly', () => {
    class Child implements Serializable {
      constructor(public v: number) {}
      toObject() {
        return { v: this.v };
      }
    }

    const user = UserEntity.create({
      name: 'A',
      age: 20,
      tags: [],
      child: new Child(5),
    });

    const obj = user.toObject();

    expect(obj['child']).toEqual({ v: 5 });
  });
});
