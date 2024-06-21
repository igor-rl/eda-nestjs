import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import {
  UserPermissionFilter,
  IUserPermissionRepository,
} from '../../../domain/user-permission-interface.repository';
import {
  UserPermission,
  IdUserPermission,
  IdContract,
  IdUser,
} from '../../../domain/user-permissions.entity';

export class UserPermissionInMemoryRepository
  extends InMemorySearchableRepository<
    UserPermission,
    IdUserPermission,
    UserPermissionFilter
  >
  implements IUserPermissionRepository {
  sortableFields: string[] = ['created_at'];

  getEntity(): new (...args: any[]) => UserPermission {
    return UserPermission;
  }

  find({
    id_contract,
    id_user,
    id_permission,
  }: {
    id_contract?: IdContract;
    id_user?: IdUser;
    id_permission?: string;
  }): Promise<UserPermission[]> {
    if (!id_user && !id_contract && !id_permission) {
      return Promise.resolve(this.items);
    }
    const items = this.items;
    if (id_user) {
      items.filter(
        (item) =>
          (typeof item.id_user !== 'number' && item.id_user.equals(id_user)) ||
          item.id_user === id_user,
      );
    }
    if (id_contract) {
      items.filter(
        (item) =>
          (typeof item.id_contract !== 'number' &&
            item.id_contract.equals(id_contract)) ||
          item.id_contract === id_contract,
      );
    }
    if (id_permission) {
      items.filter(
        (item) =>
          (typeof item.id_permission !== 'number' &&
            item.id_permission === id_permission) ||
          item.id_permission === id_permission,
      );
    }
    return Promise.resolve(items);
  }

  protected async applyFilter(
    items: UserPermission[],
    filter: UserPermissionFilter | null,
  ): Promise<UserPermission[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) => {
      const containsIdUserPermission =
        filter.id_permission && i.id_permission === filter.id_permission;
      const containsIdUser = filter.id_user && i.id_user.equals(filter.id_user);
      const containsModuloName = filter.modulo_name && i.modulo_name === filter.modulo_name;
      const filterMap = [
        [filter.id_permission, containsIdUserPermission],
        [filter.id_user, containsIdUser],
        [filter.modulo_name, containsModuloName],
      ].filter((i) => i[0]);
      return filterMap.every((i) => i[1]);
    });
  }

  protected applySort(
    items: UserPermission[],
    sort: string,
    sort_dir: SortDirection,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }
}
