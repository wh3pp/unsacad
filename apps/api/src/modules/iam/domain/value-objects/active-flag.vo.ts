import { Result, ValueObject } from '@unsacad/shared-kernel';

/**
 * Active/inactive flag VO.
 */
export class ActiveFlagVO extends ValueObject<boolean> {
  private constructor(props: { value: boolean }) {
    super(props);
  }

  static create(value: boolean): Result<ActiveFlagVO, never> {
    return Result.ok(new ActiveFlagVO({ value }));
  }

  static active(): ActiveFlagVO {
    return new ActiveFlagVO({ value: true });
  }

  static inactive(): ActiveFlagVO {
    return new ActiveFlagVO({ value: false });
  }

  public isActive(): boolean {
    return this.value === true;
  }

  public isInactive(): boolean {
    return this.value === false;
  }
}
