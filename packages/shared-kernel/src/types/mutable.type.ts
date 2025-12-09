/**
 * Removes `readonly` from all properties of a given type.
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
