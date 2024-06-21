import { Contract } from '../../../domain/contract.entity';

export type ContractOutput = {
  id: string;
  id_modulo: string;
  modulo_name: string;
  modulo_active: boolean;
};

export class ContractOutputMapper {
  static toOutput(entity: Contract): ContractOutput {
    const json = entity.toJSON();
    return {
      id: json.id_contract,
      id_modulo: json.id_modulo,
      modulo_name: json.modulo_name,
      modulo_active: json.modulo_active,
    };
  }
}
