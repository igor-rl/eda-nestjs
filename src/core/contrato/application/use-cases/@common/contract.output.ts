import { Contract } from '../../../domain/contract.entity';

export type ContractOutput = {
  id: string;
  id_api: string;
  api_name: string;
  api_active: boolean;
};

export class ContractOutputMapper {
  static toOutput(entity: Contract): ContractOutput {
    const json = entity.toJSON();
    return {
      id: json.id_contract,
      id_api: json.id_api,
      api_name: json.api_name,
      api_active: json.api_active,
    };
  }
}
