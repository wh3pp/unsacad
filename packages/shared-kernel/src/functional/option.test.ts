import { describe, test, expect } from 'bun:test';
import { Option, Some, None } from './option';
import { UnwrapOptionError } from './errors';

describe('Option Pattern', () => {
  describe('Creation (Factory Methods)', () => {
    test('some() creates an instance with value', () => {
      const option = Option.some(42);
      expect(option).toBeInstanceOf(Some);
      expect(option.isSome()).toBe(true);
      expect(option.isNone()).toBe(false);
      expect((option as Some<number>).value).toBe(42);
    });

    test('none() returns a None instance (Singleton behavior)', () => {
      const none1 = Option.none<number>();
      const none2 = Option.none<string>();

      expect(none1).toBeInstanceOf(None);
      expect(none1.isNone()).toBe(true);
      expect(none1.isSome()).toBe(false);
      expect(none1).toBe(none2 as unknown as Option<number>);
    });

    test('fromNullable()', () => {
      expect(Option.fromNullable(10).isSome()).toBe(true);
      expect(Option.fromNullable(null).isNone()).toBe(true);
      expect(Option.fromNullable(undefined).isNone()).toBe(true);
    });
  });

  describe('Transformations', () => {
    test('map() transforms value if Some, ignores if None', () => {
      const some = Option.some(5).map((x) => x * 2);
      expect(some.unwrap()).toBe(10);

      const none = Option.none<number>().map((x) => x * 2);
      expect(none.isNone()).toBe(true);
    });
    test('map() does not call mapping function for None', () => {
      let calls = 0;

      const result = Option.none<number>().map((v) => {
        calls++;
        return v * 2;
      });

      expect(result.isNone()).toBe(true);
      expect(calls).toBe(0);
    });
    test('map() calls the mapping function exactly once for Some', () => {
      let calls = 0;

      const result = Option.some(3).map((v) => {
        calls++;
        return v * 2;
      });

      expect(result.unwrap()).toBe(6);
      expect(calls).toBe(1);
    });

    test('andThen() chains operations (flatMap)', () => {
      const some = Option.some('hello').andThen((s) => Option.some(s.length));
      expect(some.unwrap()).toBe(5);

      const none = Option.none<string>().andThen((s) => Option.some(s.length));
      expect(none.isNone()).toBe(true);
    });

    test('filter() logic coverage', () => {
      const some = Option.some(10);

      expect(some.filter((x) => x > 5).isSome()).toBe(true);
      expect(some.filter((x) => x > 20).isNone()).toBe(true);

      const none = Option.none<number>();
      expect(none.filter((x) => x > 5).isNone()).toBe(true);
    });
  });

  describe('Unwrapping & Extraction', () => {
    test('match() executes correct branch', () => {
      const some = Option.some(1);
      const none = Option.none();

      const resSome = some.match({ some: (v) => v * 10, none: () => 0 });
      const resNone = none.match({ some: () => 10, none: () => 0 });

      expect(resSome).toBe(10);
      expect(resNone).toBe(0);
    });

    test('unwrap() returns value or throws', () => {
      expect(Option.some(1).unwrap()).toBe(1);
      expect(() => Option.none().unwrap()).toThrow(UnwrapOptionError);
    });

    test('unwrapOr()', () => {
      expect(Option.none<number>().unwrapOr(10)).toBe(10);
      expect(Option.some(5).unwrapOr(10)).toBe(5);
    });

    test('unwrapOrElse()', () => {
      expect(Option.none<number>().unwrapOrElse(() => 10)).toBe(10);
      expect(Option.some(5).unwrapOrElse(() => 10)).toBe(5);
    });
  });

  describe('Side Effects & Interop', () => {
    test('tap() executes callback only for Some', () => {
      let effect = 0;
      Option.some(1).tap((v) => (effect = v));
      expect(effect).toBe(1);

      effect = 0;
      Option.none<number>().tap((v) => {
        effect = v;
      });
      expect(effect).toBe(0);
    });

    test('toNullable()', () => {
      expect(Option.some('A').toNullable()).toBe('A');
      expect(Option.none().toNullable()).toBeNull();
    });

    test('toPromise()', () => {
      expect(Option.some(1).toPromise()).resolves.toBe(1);

      expect(Option.none().toPromise()).rejects.toBeInstanceOf(UnwrapOptionError);
    });

    test('equals()', () => {
      const a = Option.some(1);
      const b = Option.some(1);
      const c = Option.some(2);
      const n1 = Option.none();
      const n2 = Option.none();

      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
      expect(a.equals(n1)).toBe(false);
      expect(n1.equals(n2)).toBe(true);
    });

    test('toString()', () => {
      expect(Option.some(1).toString()).toBe('Some(1)');
      expect(Option.none().toString()).toBe('None');
    });
  });

  describe('Static Utilities', () => {
    test('combine()', () => {
      const allSome = [Option.some(1), Option.some(2)];
      expect(Option.combine(allSome).unwrap()).toEqual([1, 2]);

      const withNone = [Option.some(1), Option.none()];
      expect(Option.combine(withNone).isNone()).toBe(true);
    });

    test('all() handles tuples', () => {
      const tuple = Option.all([Option.some('s'), Option.some(1)] as const);
      expect(tuple.unwrap()).toEqual(['s', 1]);

      const failed = Option.all([Option.some(1), Option.none()]);
      expect(failed.isNone()).toBe(true);
    });
  });
});
