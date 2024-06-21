import {
  Contract,
  IdModulo,
  IdContract,
} from '../../../domain/contract.entity';
import { IContractModel } from './contract.model';

export class ContractModelMapper {
  static toModel(entity: Contract): IContractModel {
    return {
      id: entity.id_contract.id,
      id_modulo: entity.id_modulo.id,
      modulo_name: entity.modulo_name,
      modulo_active: entity.modulo_active,
    };
  }
  static toEntity(model: IContractModel): Contract {
    return new Contract({
      id_contract: new IdContract(model.id),
      id_modulo: new IdModulo(model.id_modulo),
      modulo_name: model.modulo_name,
      modulo_active: model.modulo_active,
    });
  }
}
