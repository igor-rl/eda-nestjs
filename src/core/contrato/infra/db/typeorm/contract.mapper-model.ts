import {
  Contract,
  IdApi,
  IdContract,
} from '../../../domain/contract.entity';
import { IContractModel } from './contract.model';

export class ContractModelMapper {
  static toModel(entity: Contract): IContractModel {
    return {
      id: entity.id_contract.id,
      id_api: entity.id_api.id,
      api_name: entity.api_name,
      api_active: entity.api_active,
    };
  }
  static toEntity(model: IContractModel): Contract {
    return new Contract({
      id_contract: new IdContract(model.id),
      id_api: new IdApi(model.id_api),
      api_name: model.api_name,
      api_active: model.api_active,
    });
  }
}
