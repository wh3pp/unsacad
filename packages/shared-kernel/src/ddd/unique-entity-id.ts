import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  toString() {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof UniqueEntityID)) {
      return false;
    }
    return id.toValue() === this.value;
  }
}
