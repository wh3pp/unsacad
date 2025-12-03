import { describe, test, expect } from "bun:test";

import {
  DomainInvariantViolationException,
  ForbiddenOperationException,
} from "./domain.exceptions";
import { ExceptionBase } from "./exception.base";

describe("DomainInvariantViolationException", () => {
  test("sets the correct name", () => {
    const err = new DomainInvariantViolationException("Invalid semester dates");
    expect(err.name).toBe("DomainInvariantViolationException");
  });

  test("inherits from ExceptionBase", () => {
    const err = new DomainInvariantViolationException("Oops");
    expect(err instanceof DomainInvariantViolationException).toBe(true);
    expect(err instanceof ExceptionBase).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test("propagates message, cause and metadata", () => {
    const cause = new Error("root cause");
    const metadata = { semesterId: "ABC123" };

    const err = new DomainInvariantViolationException("Invalid", {
      cause,
      metadata,
    });

    expect(err.message).toBe("Invalid");
    expect(err.cause).toBe(cause);
    expect(err.metadata).toBe(metadata);
  });

  test("toJSON formats correctly", () => {
    const err = new DomainInvariantViolationException("bad");
    const json = err.toJSON();

    expect(json.code).toBe("DomainInvariantViolationException");
    expect(json.message).toBe("bad");
    expect(json.stack).toBe(err.stack);
  });
});

describe("ForbiddenOperationException", () => {
  test("sets the correct name", () => {
    const err = new ForbiddenOperationException("Cannot enroll");
    expect(err.name).toBe("ForbiddenOperationException");
  });

  test("inherits from ExceptionBase", () => {
    const err = new ForbiddenOperationException("Nope");
    expect(err instanceof ForbiddenOperationException).toBe(true);
    expect(err instanceof ExceptionBase).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  test("propagates message, cause and metadata", () => {
    const cause = new Error("root");
    const metadata = { lab: "L1" };

    const err = new ForbiddenOperationException("Denied", {
      cause,
      metadata,
    });

    expect(err.message).toBe("Denied");
    expect(err.cause).toBe(cause);
    expect(err.metadata).toBe(metadata);
  });

  test("toJSON formats correctly", () => {
    const err = new ForbiddenOperationException("Not allowed");
    const json = err.toJSON();

    expect(json.code).toBe("ForbiddenOperationException");
    expect(json.message).toBe("Not allowed");
    expect(json.stack).toBe(err.stack);
  });
});

