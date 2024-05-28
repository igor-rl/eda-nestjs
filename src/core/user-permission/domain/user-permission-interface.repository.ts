import { ISearchableRepository } from '../../shared/domain/repository/repository.interface';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import {
  IdContract,
  IdUser,
  IdUserPermission,
  UserPermission,
} from './user-permissions.entity';

export type UserPermissionFilter = {
  id_contract?: IdContract;
  id_permission?: string;
  id_user?: IdUser;
  api_name?: string;
};

export class UserPermissionSearchParams extends SearchParams<UserPermissionFilter> {
  private constructor(
    props: SearchParamsConstructorProps<UserPermissionFilter>,
  ) {
    super(props);
  }
  static create(
    props: Omit<
      SearchParamsConstructorProps<UserPermissionFilter>,
      'filter'
    > & {
      filter?: {
        id_contract?: IdContract | string;
        id_permission?: string;
        id_user?: IdUser | string;
        nome_api?: string;
      };
    } = {},
  ) {
    const id_contract =
      props.filter?.id_contract instanceof IdContract
        ? props.filter.id_contract
        : props.filter?.id_contract && new IdContract(props.filter.id_contract);
    const id_permission = props.filter?.id_permission;
    const id_user =
      props.filter?.id_user instanceof IdUser
        ? props.filter.id_user
        : props.filter?.id_user && new IdUser(props.filter.id_user);
    return new UserPermissionSearchParams({
      ...props,
      filter: {
        id_contract: id_contract || null,
        id_permission: id_permission || null,
        id_user: id_user || null,
        api_name: props.filter?.nome_api || null,
      },
    });
  }

  get filter(): UserPermissionFilter | null {
    return this._filter;
  }

  protected set filter(value: UserPermissionFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;
    const filter = {
      ...(_value &&
        _value.id_permission && {
          id_permission: _value?.id_permission,
        }),
      ...(_value && _value.id_user && { id_user: _value?.id_user }),
    };
    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class UserPermissionSearchResult extends SearchResult<UserPermission> {}

export interface IUserPermissionRepository
  extends ISearchableRepository<
    UserPermission,
    IdUserPermission,
    UserPermissionFilter,
    UserPermissionSearchParams,
    UserPermissionSearchResult
  > {
  find({
    id_contract,
    id_user,
    id_permission,
  }: {
    id_contract?: IdContract;
    id_user?: IdUser;
    id_permission?: string;
  }): Promise<UserPermission[]>;
}
