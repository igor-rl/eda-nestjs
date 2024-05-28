import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Contract, IdContract } from '../../../domain/contract.entity';
import {
  ContractFilter,
  IContractRepository,
} from '../../../domain/contract.repository';

export class ContractInMemoryRepository
  extends InMemorySearchableRepository<Contract, IdContract, ContractFilter>
  implements IContractRepository
{
  sortableFields: string[] = ['api_name'];

  getEntity(): new (...args: any[]) => Contract {
    return Contract;
  }

  protected async applyFilter(
    items: Contract[],
    filter: ContractFilter,
  ): Promise<Contract[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) => {
      const containsIdApi = filter.id_api && i.id_api === filter.id_api;
      const containsApiName = filter.api_name && i.api_name === filter.api_name;
      const containsAtivo = filter.api_active && i.api_active === true;
      const containsDesativado =
        filter.api_not_active && i.api_active === false;
      const filterMap = [
        [filter.id_api, containsIdApi],
        [filter.api_active, containsAtivo],
        [filter.api_name, containsApiName],
        [filter.api_not_active, containsDesativado],
      ].filter((i) => i[0]);
      return filterMap.every((i) => i[1]);
    });
  }

  protected applySort(
    items: Contract[],
    sort: string,
    sort_dir: SortDirection,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'api_name', 'desc');
  }
}
