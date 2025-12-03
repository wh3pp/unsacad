import { ArgumentInvalidException, ValueObject, type DomainPrimitive } from "@university/shared-kernel";

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class ExternalKeyVO extends ValueObject<string> {
  protected validate(props: DomainPrimitive<string>): void {
    const raw = props.value.trim();

    if (!UUID_V4_REGEX.test(raw)) {
      throw new ArgumentInvalidException("ExternalKey must be a valid UUID v4");
    }

    props.value = raw;
  }

  /**
   * Factory method to auto-generate a UUID v4.
   */
  static generate(): ExternalKeyVO {
    const uuid = crypto.randomUUID();
    return new ExternalKeyVO({ value: uuid });
  }
}
