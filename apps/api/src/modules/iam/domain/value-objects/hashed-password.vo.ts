import {
  ArgumentInvalidException,
  ValueObject,
  type DomainPrimitive,
} from '@unsacad/shared-kernel';

export class HashedPasswordVO extends ValueObject<string> {
  protected validate(props: DomainPrimitive<string>): void {
    const value = props.value.trim();

    if (value.length < 20) {
      throw new ArgumentInvalidException('Password hash is invalid');
    }

    // TODO: ensue format (bcrypt, argon, etc.)
    props.value = value;
  }
}
