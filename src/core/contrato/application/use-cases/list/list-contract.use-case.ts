import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import {
  ContractSearchParams,
  ContractSearchResult,
  IContractRepository,
} from '../../../domain/contract.repository';
import {
  ContractOutput,
  ContractOutputMapper,
} from '../@common/contract.output';
import { ListContractsInput } from './list-contract.input';

export type ListContractsOutput = PaginationOutput<ContractOutput>;

export class ListContractsUseCase
  implements IUseCase<ListContractsInput, ListContractsOutput>
{
  constructor(private repository: IContractRepository) {}

  async execute(input: ListContractsInput): Promise<ListContractsOutput> {
    const params = ContractSearchParams.create(input);
    const searchResult = await this.repository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: ContractSearchResult): ListContractsOutput {
    const { items: _items } = searchResult;
    const items = _items.map((item) => ContractOutputMapper.toOutput(item));
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
