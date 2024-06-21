import { Entity } from '../../shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { ContractFakeBuilder } from './contract-fake.builder';
import ContractValidatorFactory from './contract.validators';

export class IdContract extends Uuid { }
export class IdModulo extends Uuid { }

export type ContractCreateCommand = {
  id_contract?: IdContract;
  id_modulo: IdModulo;
  modulo_name: string;
  modulo_active?: boolean;
};

export class ContractConstructorProps {
  id_contract?: IdContract;
  id_modulo: IdModulo;
  modulo_name: string;
  modulo_active?: boolean;
}

export class Contract extends Entity {
  id_contract: IdContract;
  id_modulo: IdModulo;
  modulo_name: string;
  modulo_active?: boolean;

  constructor(props: ContractConstructorProps) {
    super();
    this.id_contract = props.id_contract ?? new IdContract();
    this.id_modulo = props.id_modulo;
    this.modulo_name = props.modulo_name;
    this.modulo_active = props.modulo_active ?? true;
  }

  static create(props: ContractCreateCommand) {
    return new Contract({
      id_contract: props.id_contract,
      id_modulo: props.id_modulo,
      modulo_name: props.modulo_name,
      modulo_active: props.modulo_active,
    });
  }

  activate() {
    this.modulo_active = true;
  }

  deactivate() {
    this.modulo_active = false;
  }

  validate(fields?: string[]) {
    const validator = ContractValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return ContractFakeBuilder;
  }

  get entity_id() {
    return this.id_contract;
  }

  toJSON() {
    return {
      id_contract: this.id_contract.id,
      id_modulo: this.id_modulo.id,
      modulo_name: this.modulo_name,
      modulo_active: this.modulo_active,
    };
  }
}
