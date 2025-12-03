import { ArgumentInvalidException, ValueObject, type DomainPrimitive } from "@university/shared-kernel";
import { UserRole } from "../iam.types";

export class UserRoleVO extends ValueObject<UserRole> {
  protected validate(props: DomainPrimitive<UserRole>): void {
    if (!Object.values(UserRole).includes(props.value)) {
      throw new ArgumentInvalidException("Invalid user role");
    }
  }
}
