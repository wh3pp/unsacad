import { ValueObject } from '@unsacad/shared-kernel';

/**
 * Active/inactive flag VO.
 */
export class ActiveFlagVO extends ValueObject<boolean> {
  protected validate(): void {}

  activate(): ActiveFlagVO {
    return new ActiveFlagVO({ value: true });
  }

  deactivate(): ActiveFlagVO {
    return new ActiveFlagVO({ value: false });
  }
}
