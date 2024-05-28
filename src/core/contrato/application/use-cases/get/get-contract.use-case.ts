import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { IdContract, Contract } from '../../../domain/contract.entity';
import { IContractRepository } from '../../../domain/contract.repository';
import {
  ContractOutputMapper,
  ContractOutput,
} from '../@common/contract.output';

export class GetContractUseCase
  implements IUseCase<GetContractInput, GetContractOutput>
{
  constructor(private readonly repository: IContractRepository) {}

  async execute(input: GetContractInput): Promise<GetContractOutput> {
    const idContract = new IdContract(input.id);
    const model = await this.repository.findById(idContract);
    if (!model) {
      throw new NotFoundError(idContract.id, Contract);
    }
    return ContractOutputMapper.toOutput(model);
  }
}

export type GetContractInput = {
  id: string;
};

export type GetContractOutput = ContractOutput;
