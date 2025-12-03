import { ArgumentInvalidException, ArgumentNotProvidedException } from 'src/exceptions';

export class Guard {
  static isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim().length === 0) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (value instanceof Date) return false;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  static againstNullOrUndefined(value: unknown, name: string): void {
    if (value === null || value === undefined) {
      throw new ArgumentNotProvidedException(`${name} cannot be null or undefined`);
    }
  }

  static againstEmpty(value: unknown, name: string): void {
    if (Guard.isEmpty(value)) {
      throw new ArgumentInvalidException(`${name} cannot be empty`);
    }
  }
}
