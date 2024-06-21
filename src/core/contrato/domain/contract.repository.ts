import { ISearchableRepository } from '../../shared/domain/repository/repository.interface';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { Contract, IdModulo, IdContract } from './contract.entity';

export type ContractFilter = {
  id_modulo?: IdModulo;
  modulo_name?: string;
  modulo_active?: boolean;
  api_not_active?: boolean;
};

export class ContractSearchParams extends SearchParams<ContractFilter> {
  private constructor(props: SearchParamsConstructorProps<ContractFilter>) {
    super(props);
  }
  static create(
    props: Omit<SearchParamsConstructorProps<ContractFilter>, 'filter'> & {
      filter?: {
        id_modulo?: IdModulo | string;
        modulo_name?: string | null;
        modulo_active?: boolean | string;
        api_not_active?: boolean | string;
      };
    } = {},
  ) {
    const id_modulo =
      props.filter?.id_modulo instanceof IdModulo
        ? props.filter.id_modulo
        : props.filter?.id_modulo && new IdModulo(props.filter.id_modulo);
    return new ContractSearchParams({
      ...props,
      filter: {
        id_modulo: id_modulo || null,
        modulo_name: props.filter?.modulo_name || '',
        modulo_active:
          props.filter?.modulo_active === true ||
            props.filter?.modulo_active === 'true'
            ? true
            : null,
        api_not_active:
          props.filter?.modulo_active === false ||
            props.filter?.modulo_active === 'false'
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
        _value.id_modulo && {
        id_modulo: _value?.id_modulo,
      }),
      ...(_value && _value.modulo_name && { modulo_name: `${_value?.modulo_name}` }),
      ...(_value && _value.modulo_active && { modulo_active: _value?.modulo_active }),
      ...(_value &&
        _value.api_not_active && { api_not_active: _value?.api_not_active }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class ContractSearchResult extends SearchResult<Contract> { }

export interface IContractRepository
  extends ISearchableRepository<
    Contract,
    IdContract,
    ContractFilter,
    ContractSearchParams,
    ContractSearchResult
  > { }
