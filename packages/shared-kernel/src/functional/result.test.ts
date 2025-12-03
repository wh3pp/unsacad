import { describe, test, expect } from 'bun:test';
import { Result, ResultKind } from './result';
import { UnwrapResultError } from './errors';

describe('Result', () => {
  describe('type guards', () => {
    test('isOk identifies Ok', () => {
      expect(Result.isOk(Result.ok(1))).toBe(true);
      expect(Result.isOk(Result.err('x'))).toBe(false);
    });

    test('isErr identifies Err', () => {
      expect(Result.isErr(Result.err('x'))).toBe(true);
      expect(Result.isErr(Result.ok(1))).toBe(false);
    });
  });

  describe('unwrap()', () => {
    test('unwrap(Ok) returns value', () => {
      expect(Result.unwrap(Result.ok(5))).toBe(5);
    });

    test('unwrap(Err) throws', () => {
      expect(() => Result.unwrap(Result.err('e'))).toThrow(UnwrapResultError);
    });
  });

  describe('unwrapErr()', () => {
    test('unwrapErr(Err) returns error', () => {
      expect(Result.unwrapErr(Result.err('boom'))).toBe('boom');
    });

    test('unwrapErr(Ok) throws', () => {
      expect(() => Result.unwrapErr(Result.ok(1))).toThrow(UnwrapResultError);
    });
  });

  describe('unwrapOr()', () => {
    test('Ok → returns value', () => {
      expect(Result.unwrapOr(Result.ok(10), 0)).toBe(10);
    });

    test('Err → returns default', () => {
      expect(Result.unwrapOr(Result.err('e'), 0)).toBe(0);
    });
  });

  describe('unwrapOrElse()', () => {
    test('Ok → returns value', () => {
      expect(Result.unwrapOrElse(Result.ok(10), () => 0)).toBe(10);
    });

    test('Err → calls fallback', () => {
      expect(Result.unwrapOrElse(Result.err('x'), (err) => `err:${err}`)).toBe('err:x');
    });
  });

  describe('map()', () => {
    test('Ok → applies fn', () => {
      const r = Result.map(Result.ok(2), (x) => x * 3);

      expect(r).toMatchObject({
        kind: ResultKind.Ok,
        value: 6,
      });
    });

    test('Err → returns Err unchanged', () => {
      const r = Result.map(Result.err('fail'), (x) => x);

      expect(r).toMatchObject({
        kind: ResultKind.Err,
        error: 'fail',
      });
    });
  });

  describe('mapErr()', () => {
    test('Err → applies fn to error', () => {
      const r = Result.mapErr(Result.err('boom'), (e) => e.toUpperCase());

      expect(r).toMatchObject({
        kind: ResultKind.Err,
        error: 'BOOM',
      });
    });

    test('Ok → returns Ok unchanged', () => {
      const r = Result.mapErr(Result.ok(10), (e) => e);

      expect(r).toMatchObject({
        kind: ResultKind.Ok,
        value: 10,
      });
    });
  });

  describe('andThen()', () => {
    test('Ok → calls fn and returns new Result', () => {
      const r = Result.andThen(Result.ok(2), (x) => Result.ok(x + 1));

      expect(r).toMatchObject({
        kind: ResultKind.Ok,
        value: 3,
      });
    });

    test('Ok → fn returns Err', () => {
      const r = Result.andThen(Result.ok(2), () => Result.err('nope'));

      expect(r).toMatchObject({
        kind: ResultKind.Err,
        error: 'nope',
      });
    });

    test('Err → returns Err unchanged', () => {
      const r = Result.andThen(Result.err('boom'), () => Result.ok(1));

      expect(r).toMatchObject({
        kind: ResultKind.Err,
        error: 'boom',
      });
    });
  });

  describe('match()', () => {
    test('Ok → calls ok handler', () => {
      const r = Result.match(Result.ok(1), {
        ok: (v) => `ok:${v}`,
        err: () => 'err',
      });

      expect(r).toBe('ok:1');
    });

    test('Err → calls err handler', () => {
      const r = Result.match(Result.err('boom'), {
        ok: () => 'ok',
        err: (e) => `err:${e}`,
      });

      expect(r).toBe('err:boom');
    });
  });

  describe('fromThrowable()', () => {
    test('returns Ok when fn succeeds', () => {
      const r = Result.fromThrowable(() => 10);
      expect(r).toMatchObject({ kind: ResultKind.Ok, value: 10 });
    });

    test('returns Err when fn throws', () => {
      const r = Result.fromThrowable(() => {
        throw new Error('oh no');
      });

      expect(Result.isErr(r)).toBe(true);
    });
  });

  describe('fromPromise()', () => {
    test('Ok when promise resolves', async () => {
      const r = await Result.fromPromise(Promise.resolve(10));
      expect(r).toMatchObject({ kind: ResultKind.Ok, value: 10 });
    });

    test('Err when promise rejects', async () => {
      const r = await Result.fromPromise(Promise.reject(new Error('boom')));
      expect(Result.isErr(r)).toBe(true);
    });
  });
});
