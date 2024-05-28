import { ISearchableRepository } from '../../shared/domain/repository/repository.interface';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { Contract, IdApi, IdContract } from './contract.entity';

export type ContractFilter = {
  id_api?: IdApi;
  api_name?: string;
  api_active?: boolean;
  api_not_active?: boolean;
};

export class ContractSearchParams extends SearchParams<ContractFilter> {
  private constructor(props: SearchParamsConstructorProps<ContractFilter>) {
    super(props);
  }
  static create(
    props: Omit<SearchParamsConstructorProps<ContractFilter>, 'filter'> & {
      filter?: {
        id_api?: IdApi | string;
        api_name?: string | null;
        api_active?: boolean | string;
        api_not_active?: boolean | string;
      };
    } = {},
  ) {
    const id_api =
      props.filter?.id_api instanceof IdApi
        ? props.filter.id_api
        : props.filter?.id_api && new IdApi(props.filter.id_api);
    return new ContractSearchParams({
      ...props,
      filter: {
        id_api: id_api || null,
        api_name: props.filter?.api_name || '',
        api_active:
          props.filter?.api_active === true ||
          props.filter?.api_active === 'true'
            ? true
            : null,
        api_not_active:
          props.filter?.api_active === false ||
          props.filter?.api_active === 'false'
            ? true
            : null,
      },
    });
  }

  get filter(): ContractFilter | null {
    return this._filter;
  }

  protected set filter(value: ContractFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;

    const filter = {
      ...(_value &&
        _value.id_api && {
          id_api: _value?.id_api,
        }),
      ...(_value && _value.api_name && { api_name: `${_value?.api_name}` }),
      ...(_value && _value.api_active && { api_active: _value?.api_active }),
      ...(_value &&
        _value.api_not_active && { api_not_active: _value?.api_not_active }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class ContractSearchResult extends SearchResult<Contract> {}

export interface IContractRepository
  extends ISearchableRepository<
    Contract,
    IdContract,
    ContractFilter,
    ContractSearchParams,
    ContractSearchResult
  > {}
