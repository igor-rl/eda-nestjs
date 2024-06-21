import { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Contract, IdModulo, IdContract } from '../../../domain/contract.entity';
import { IContractRepository } from '../../../domain/contract.repository';
import {
  ContractOutput,
  ContractOutputMapper,
} from '../@common/contract.output';
import { CreateContractInput } from './create-contract.input';

export type CreateContractOutput = ContractOutput;

export class CreateContractUseCase
  implements IUseCase<CreateContractInput, CreateContractOutput> {
  constructor(private readonly contractRepository: IContractRepository) { }

  async execute(input: CreateContractInput): Promise<ContractOutput> {
    const id_contract = new IdContract(input.id_contract);
    const id_modulo = new IdModulo(input.id_modulo);
    const entity = Contract.create({
      ...input,
      id_modulo,
      id_contract,
    });
    const notification = entity.notification;
    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }
    await this.contractRepository.insert(entity);
    return ContractOutputMapper.toOutput(entity);
  }
}
