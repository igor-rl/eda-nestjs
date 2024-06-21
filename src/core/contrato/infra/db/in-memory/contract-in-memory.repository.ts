import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Contract, IdContract } from '../../../domain/contract.entity';
import {
  ContractFilter,
  IContractRepository,
} from '../../../domain/contract.repository';

export class ContractInMemoryRepository
  extends InMemorySearchableRepository<Contract, IdContract, ContractFilter>
  implements IContractRepository {
  sortableFields: string[] = ['modulo_name'];

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
      const containsIdModulo = filter.id_modulo && i.id_modulo === filter.id_modulo;
      const containsModuloName = filter.modulo_name && i.modulo_name === filter.modulo_name;
      const containsAtivo = filter.modulo_active && i.modulo_active === true;
      const containsDesativado =
        filter.api_not_active && i.modulo_active === false;
      const filterMap = [
        [filter.id_modulo, containsIdModulo],
        [filter.modulo_active, containsAtivo],
        [filter.modulo_name, containsModuloName],
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
      : super.applySort(items, 'modulo_name', 'desc');
  }
}
