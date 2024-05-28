import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { IdContract, Contract } from '../../../domain/contract.entity';
import { IContractRepository } from '../../../domain/contract.repository';
import {
  ContractOutputMapper,
  ContractOutput,
} from '../@common/contract.output';
import { UpdateContractInput } from './update-contract.input';

export class UpdateContractUseCase
  implements IUseCase<UpdateContractInput, UpdateContractOutput>
{
  constructor(private repository: IContractRepository) {}

  async execute(input: UpdateContractInput): Promise<UpdateContractOutput> {
    const idContract = new IdContract(input.id);
    const model = await this.repository.findById(idContract);
    if (!model) {
      throw new NotFoundError(idContract.id, Contract);
    }
    input.api_active && model.activate();
    !input.api_active && model.deactivate();
    if (model.notification.hasErrors()) {
      throw new EntityValidationError(model.notification.toJSON());
    }
    await this.repository.update(model);
    return ContractOutputMapper.toOutput(model);
  }
}

export type UpdateContractOutput = ContractOutput;
