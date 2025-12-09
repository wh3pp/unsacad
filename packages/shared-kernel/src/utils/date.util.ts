/**
 * Date utility helpers.
 */
export const DateUtil = {
  /**
   * Returns the current date instance.
   */
  now(): Date {
    return new Date();
  },

  /**
   * Returns the current timestamp as an ISO 8601 string (UTC).
   */
  nowISO(): string {
    return new Date().toISOString();
  },

  /**
   * Returns true if `a` occurs before `b`.
   */
  isBefore(a: Date, b: Date): boolean {
    return a.getTime() < b.getTime();
  },

  /**
   * Returns true if `a` occurs after `b`.
   */
  isAfter(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime();
  },

  /**
   * Returns a NEW Date by adding `days` to a given date.
   * Does not mutate the input date.
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
   * Returns the start of the day (00:00:00.000) in local server time.
   */
  startOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  },

  /**
   * Returns the start of the day in strict UTC (00:00:00.000Z).
   */
  startOfUTCDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate;
  },
} as const;
