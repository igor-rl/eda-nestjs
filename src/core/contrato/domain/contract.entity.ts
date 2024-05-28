import { Entity } from '../../shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { ContractFakeBuilder } from './contract-fake.builder';
import ContractValidatorFactory from './contract.validators';

export class IdContract extends Uuid {}
export class IdApi extends Uuid {}

export type ContractCreateCommand = {
  id_contract?: IdContract;
  id_api: IdApi;
  api_name: string;
  api_active?: boolean;
};

export class ContractConstructorProps {
  id_contract?: IdContract;
  id_api: IdApi;
  api_name: string;
  api_active?: boolean;
}

export class Contract extends Entity {
  id_contract: IdContract;
  id_api: IdApi;
  api_name: string;
  api_active?: boolean;

  constructor(props: ContractConstructorProps) {
    super();
    this.id_contract = props.id_contract ?? new IdContract();
    this.id_api = props.id_api;
    this.api_name = props.api_name;
    this.api_active = props.api_active ?? true;
  }

  static create(props: ContractCreateCommand) {
    return new Contract({
      id_contract: props.id_contract,
      id_api: props.id_api,
      api_name: props.api_name,
      api_active: props.api_active,
    });
  }

  activate() {
    this.api_active = true;
  }

  deactivate() {
    this.api_active = false;
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
      id_api: this.id_api.id,
      api_name: this.api_name,
      api_active: this.api_active,
    };
  }
}
