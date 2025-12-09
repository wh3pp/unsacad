import { describe, test, expect } from 'bun:test';
import { Result, Ok, Err } from './result';
import { UnwrapResultError } from './errors';

describe('Result Pattern', () => {
  describe('Creation (Factory Methods)', () => {
    test('ok() creates an Ok instance', () => {
      const value = 'success';
      const result = Result.ok(value);
      expect(result).toBeInstanceOf(Ok);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect((result as Ok<string, never>).value).toBe(value);
    });

    test('err() creates an Err instance', () => {
      const error = new Error('fail');
      const result = Result.err(error);
      expect(result).toBeInstanceOf(Err);
      expect(result.isErr()).toBe(true);
      expect(result.isOk()).toBe(false);
      expect((result as Err<never, Error>).error).toBe(error);
    });

    test('fromThrowable() captures return value as Ok', () => {
      const fn = () => 100;
      const result = Result.fromThrowable(fn);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(100);
    });

    test('fromThrowable() captures exception as Err', () => {
      const error = new Error('boom');
      const fn = () => {
        throw error;
      };
      const result = Result.fromThrowable(fn);
      expect(result.isErr()).toBe(true);
      expect((result as Err<never, Error>).error).toBe(error);
    });

    test('fromPromise() resolves to Ok', async () => {
      const promise = Promise.resolve('async success');
      const result = await Result.fromPromise(promise);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('async success');
    });

    test('fromPromise() rejects to Err', async () => {
      const error = new Error('async fail');
      const promise = Promise.reject(error);
      const result = await Result.fromPromise(promise);
      expect(result.isErr()).toBe(true);
      expect((result as Err<never, Error>).error).toBe(error);
    });
  });

  describe('Transformations', () => {
    test('map() transforms value if Ok', () => {
      const result = Result.ok(10);
      const mapped = result.map((x) => x * 2);
      expect(mapped.isOk()).toBe(true);
      expect(mapped.unwrap()).toBe(20);
    });

    test('map() ignores transformation if Err', () => {
      const result = Result.err<number, string>('error');
      const mapped = result.map((x) => x * 2);
      expect(mapped.isErr()).toBe(true);
      expect((mapped as Err<number, string>).error).toBe('error');
    });

    test('mapErr() transforms error if Err', () => {
      const result = Result.err('original error');
      const mapped = result.mapErr((e) => e.toUpperCase());
      expect(mapped.isErr()).toBe(true);
      expect((mapped as Err<never, string>).error).toBe('ORIGINAL ERROR');
    });

    test('mapErr() ignores transformation if Ok', () => {
      const result = Result.ok(10);
      const mapped = result.mapErr(() => 'new error');
      expect(mapped.isOk()).toBe(true);
      expect(mapped.unwrap()).toBe(10);
    });

    test('andThen() chains successful operations', () => {
      const result = Result.ok<string, string>('user');
      const nextStep = (val: string) => Result.ok<string, string>(`${val}_saved`);
      const chained = result.andThen(nextStep);
      expect(chained.isOk()).toBe(true);
      expect(chained.unwrap()).toBe('user_saved');
    });

    test('andThen() short-circuits on first Err', () => {
      const result = Result.err<string, string>('fail step 1');
      const nextStep = (val: string) => Result.ok<string, string>(`${val}_saved`);
      const chained = result.andThen(nextStep);
      expect(chained.isErr()).toBe(true);
      expect((chained as Err<never, string>).error).toBe('fail step 1');
    });

    test('andThen() returns new Err from chain', () => {
      const result = Result.ok('success step 1');
      const nextStep = (_: string) => Result.err('fail step 2');
      const chained = result.andThen(nextStep);
      expect(chained.isErr()).toBe(true);
      expect((chained as Err<never, string>).error).toBe('fail step 2');
    });
  });

  describe('Unwrapping & Extraction', () => {
    test('match() executes correct branch', () => {
      const ok = Result.ok(1);
      const err = Result.err('bad');
      const resOk = ok.match({ ok: (v) => v + 1, err: () => 0 });
      const resErr = err.match({ ok: () => 0, err: (e) => e.length });
      expect(resOk).toBe(2);
      expect(resErr).toBe(3);
    });

    test('unwrap() returns value for Ok', () => {
      const result = Result.ok(5);
      expect(result.unwrap()).toBe(5);
    });

    test('unwrap() throws for Err', () => {
      const result = Result.err('oops');
      expect(() => result.unwrap()).toThrow(UnwrapResultError);
    });

    test('unwrapOr() returns value or default', () => {
      const ok = Result.ok(1);
      const err = Result.err<number, string>('e');
      expect(ok.unwrapOr(99)).toBe(1);
      expect(err.unwrapOr(99)).toBe(99);
    });

    test('unwrapOrElse() computes value lazily on error', () => {
      const err = Result.err<string, string>('error');
      const val = err.unwrapOrElse((e) => `recovered: ${e}`);
      expect(val).toBe('recovered: error');
    });
  });

  describe('Side Effects', () => {
    test('tap() runs callback on Ok', () => {
      let sideEffect = 0;
      const result = Result.ok(10);
      result.tap((v) => {
        sideEffect = v;
      });
      expect(sideEffect).toBe(10);
    });

    test('tap() ignores Err', () => {
      let sideEffect = 0;
      const result = Result.err('error');
      result.tap((v) => {
        sideEffect = v;
      });
      expect(sideEffect).toBe(0);
    });

    test('tapErr() runs callback on Err', () => {
      let errorLog = '';
      const result = Result.err('connection failed');
      result.tapErr((e) => {
        errorLog = e;
      });
      expect(errorLog).toBe('connection failed');
    });
  });

  describe('Interop', () => {
    test('toPromise() resolves on Ok', async () => {
      const result = Result.ok('yes');
      const val = await result.toPromise();
      expect(val).toBe('yes');
    });

    test('toPromise() rejects on Err', async () => {
      const original = 'no';
      const result = Result.err(original);

      try {
        await result.toPromise();
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(UnwrapResultError);

        const err = e as UnwrapResultError;

        expect(err.message).toContain(original);
        expect(err.cause).toBe(original);
      }
    });
  });

  describe('Static Utilities (Combine & All)', () => {
    test('combine() merges homogeneous array of Ok', () => {
      const results = [Result.ok(1), Result.ok(2)];
      const combined = Result.combine(results);
      expect(combined.isOk()).toBe(true);
      expect(combined.unwrap()).toEqual([1, 2]);
    });

    test('combine() returns first error if any fail', () => {
      const results: Result<number, string>[] = [
        Result.ok(1),
        Result.err('fail 1'),
        Result.err('fail 2'),
      ];
      const combined = Result.combine(results);
      expect(combined.isErr()).toBe(true);
      expect((combined as Err<never, string>).error).toBe('fail 1');
    });

    test('combine() accepts readonly arrays', () => {
      const results: readonly Result<number, string>[] = [Result.ok(1), Result.ok(2)];
      const combined = Result.combine(results);
      expect(combined.isOk()).toBe(true);
    });

    test('all() handles tuples with mixed types correctly', () => {
      const inputs = [Result.ok('string'), Result.ok(123), Result.ok(true)] as const;

      const combined = Result.all(inputs);

      expect(combined.isOk()).toBe(true);

      const [str, num, bool] = combined.unwrap();
      expect(str).toBe('string');
      expect(num).toBe(123);
      expect(bool).toBe(true);
    });

    test('all() returns error on tuple failure', () => {
      const inputs = [Result.ok(1), Result.err('bad input')];
      const combined = Result.all(inputs);
      expect(combined.isErr()).toBe(true);
      expect((combined as Err<never, string>).error).toBe('bad input');
    });
  });

  describe('Equality', () => {
    test('equals() compares structure correctly', () => {
      const ok1 = Result.ok(1);
      const ok2 = Result.ok(1);
      const ok3 = Result.ok(2);
      const err1: Result<number, string> = Result.err('e');
      const err2: Result<number, string> = Result.err('e');

      expect(ok1.equals(ok2)).toBe(true);
      expect(ok1.equals(ok3)).toBe(false);
      expect(err1.equals(err2)).toBe(true);
      expect(ok1.equals(err1)).toBe(false);
    });
  });
  describe('String Representation', () => {
    test('toString() prints Ok correctly', () => {
      const result = Result.ok({ a: 1 });
      expect(result.toString()).toBe('Ok({"a":1})');
    });

    test('toString() prints Err correctly', () => {
      const result = Result.err('fatal');
      expect(result.toString()).toBe('Err("fatal")');
    });

    test('toString() prints nested objects', () => {
      const result = Result.err({ error: 'bad', code: 500 });
      expect(result.toString()).toBe('Err({"error":"bad","code":500})');
    });
  });
});
