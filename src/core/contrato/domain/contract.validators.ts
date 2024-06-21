import { MaxLength } from 'class-validator';
import { Contract } from './contract.entity';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';

export class ContractRoles {
  @MaxLength(255, { groups: ['modulo_name'] })
  modulo_name: string;

  constructor(entity: Contract) {
    Object.assign(this, entity);
  }
}

export class ContractValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Contract,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['modulo_name'];
    return super.validate(notification, new ContractRoles(data), newFields);
  }
}

export class ContractValidatorFactory {
  static create() {
    return new ContractValidator();
  }
}

export default ContractValidatorFactory;
