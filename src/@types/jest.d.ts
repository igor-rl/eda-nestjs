import { FieldsErrors } from '../core/shared/domain/validators/validator-fields-interface';
import { ValueObject } from '../core/shared/domain/value-object';

declare global {
  namespace jest {
    interface Matchers<R> {
      //containsErrorMessages: (expected: FieldsErrors) => R;
      notificationContainsErrorMessages: (expected: Array<FieldsErrors>) => R;
      toBeValueObject: (expected: ValueObject) => R;
    }
  }
}
