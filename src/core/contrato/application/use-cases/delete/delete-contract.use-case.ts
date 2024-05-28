import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IdContract } from '../../../domain/contract.entity';
import { IContractRepository } from '../../../domain/contract.repository';

export class DeleteContractUseCase
  implements IUseCase<DeleteContractInput, DeleteContractOutput>
{
  constructor(private readonly repository: IContractRepository) {}

  async execute(input: DeleteContractInput): Promise<DeleteContractOutput> {
    const idContract = new IdContract(input.id);
    await this.repository.delete(idContract);
  }
}

export type DeleteContractInput = {
  id: string;
};

type DeleteContractOutput = void;
