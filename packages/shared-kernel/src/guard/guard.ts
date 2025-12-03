import { ArgumentInvalidException, ArgumentNotProvidedException } from 'src/exceptions';

export class Guard {
  static isEmpty(value: unknown): boolean {
    if (Guard.isNullish(value)) return true;

    if (typeof value === 'string') return Guard.isEmptyString(value);

    if (Array.isArray(value)) return Guard.isEmptyArray(value);

    if (value instanceof Date) return false;

    if (value instanceof Map || value instanceof Set) {
      return Guard.isEmptyMapOrSet(value);
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      return Guard.objectEntriesAreEmpty(entries);
    }

    return false;
  }

  static againstNullOrUndefined(value: unknown, name: string): void {
    if (Guard.isNullish(value)) {
      throw new ArgumentNotProvidedException(`${name} cannot be null or undefined`);
    }
  }

  static againstEmpty(value: unknown, name: string): void {
    if (Guard.isEmpty(value)) {
      throw new ArgumentInvalidException(`${name} cannot be empty`);
    }
  }

  private static isNullish(value: unknown): boolean {
    return value === null || value === undefined;
  }

  private static isEmptyString(value: string): boolean {
    return value.trim().length === 0;
  }

  private static isEmptyArray(value: unknown[]): boolean {
    return value.length === 0;
  }

  private static isEmptyMapOrSet(value: Map<unknown, unknown> | Set<unknown>): boolean {
    return value.size === 0;
  }

  private static objectEntriesAreEmpty(entries: [string, unknown][]): boolean {
    if (entries.length === 0) return true;
    return entries.every(([_, v]) => Guard.isEmpty(v));
  }
}
