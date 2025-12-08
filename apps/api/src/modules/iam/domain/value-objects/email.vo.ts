import {
  ArgumentInvalidException,
  ValueObject,
  type DomainPrimitive,
} from '@unsacad/shared-kernel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Email value object.
 */
export class EmailVO extends ValueObject<string> {
  protected validate(props: DomainPrimitive<string>): void {
    const value = props.value.trim().toLowerCase();

    if (!EMAIL_REGEX.test(value)) {
      throw new ArgumentInvalidException('Invalid email format');
    }
    props.value = value;
  }
}
