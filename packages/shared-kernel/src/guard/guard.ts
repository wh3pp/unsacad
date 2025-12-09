/**
 * Utility object for common validation checks (guards).
 */
export const Guard = {
  /**
   * Returns true if the value is null, undefined, an empty string, or an empty array.
   */
  isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim().length === 0) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  },

  /**
   * Returns true if `value` is shorter than `minLength`.
   */
  isShort(value: string | unknown[], minLength: number): boolean {
    return value.length < minLength;
  },

  /**
   * Returns true if `value` is longer than `maxLength`.
   */
  isLong(value: string | unknown[], maxLength: number): boolean {
    return value.length > maxLength;
  },

  /**
   * Returns true if `value` is outside the inclusive range [min, max].
   */
  isOutOfRange(value: number, min: number, max: number): boolean {
    return value < min || value > max;
  },
} as const;
