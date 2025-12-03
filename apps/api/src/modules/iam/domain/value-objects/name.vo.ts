import { ArgumentInvalidException, ValueObject, type DomainPrimitive } from "@university/shared-kernel";
/**
 * Represents any human name component (first name or last name).
 * Normalized to FULL UPPERCASE.
 */
export class NameVO extends ValueObject<string> {
  protected validate(props: DomainPrimitive<string>): void {
    let value = props.value.trim();

    if (value.length < 2) {
      throw new ArgumentInvalidException("Name must be at least 2 characters");
    }

    if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ' -]+$/.test(value)) {
      throw new ArgumentInvalidException("Name contains invalid characters");
    }

    value = value.toUpperCase();
    props.value = value;
  }
}
