import { In, Repository } from 'typeorm';
import { UserPermissionModel } from './user-permission.model';
import { UserPermissionModelMapper } from './user-permission.mapper-model';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument.error';
import {
  IUserPermissionRepository,
  UserPermissionSearchParams,
  UserPermissionSearchResult,
} from '../../../domain/user-permission-interface.repository';
import {
  UserPermission,
  IdUserPermission,
  IdContract,
  IdUser,
} from '../../../domain/user-permissions.entity';

export class UserPermissionTypeOrmRepository
  implements IUserPermissionRepository
{
  sortableFields: string[] = [];

  constructor(private repository: Repository<UserPermissionModel>) {}

  async insert(aggregate: UserPermission): Promise<void> {
    const model = UserPermissionModelMapper.toModel(aggregate);
    await this.repository.insert(model);
  }

  async bulkInsert(entities: UserPermission[]): Promise<void> {
    const models = entities.map((entity) =>
      UserPermissionModelMapper.toModel(entity),
    );
    await this.repository.insert(models);
  }

  async update(aggregate: UserPermission): Promise<void> {
    const id = aggregate.id_permission;
    const model = UserPermissionModelMapper.toModel(aggregate);
    const { affected } = await this.repository.update(id, model);
    if (affected !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async delete(id: IdUserPermission): Promise<void> {
    const { affected } = await this.repository.delete(id.id);
    if (affected !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async findByIds(ids_: IdUserPermission[]): Promise<UserPermission[]> {
    const ids = ids_.map((id) => id);
    const models = await this.repository.find({
      where: {
        id: In(ids),
      },
    });
    return models.map((model) => UserPermissionModelMapper.toEntity(model));
  }

  async existsById(
    ids: IdUserPermission[],
  ): Promise<{ exists: IdUserPermission[]; not_exists: IdUserPermission[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }
    const existsModels = await this.repository.find({
      select: ['id'],
      where: {
        id: In(ids.map((id) => id)),
      },
    });
    const existsIds = existsModels.map(
      (model) => new IdUserPermission(model.id),
    );
    const notExistsIds = ids.filter(
      (id) => !existsIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsIds,
      not_exists: notExistsIds,
    };
  }

  async findById(id: IdUserPermission): Promise<UserPermission> {
    const model = await this.repository.findOneBy({
      id: id.id,
    });
    return model ? UserPermissionModelMapper.toEntity(model) : null;
  }

  async find({
    id_contract,
    id_user,
    id_permission,
  }: {
    id_contract?: IdContract;
    id_user?: IdUser;
    id_permission?: string;
  }): Promise<UserPermission[]> {
    const wheres: any[] = [];
    if (id_contract) {
      wheres.push({
        id_contract: id_contract.id,
      });
    }
    if (id_user) {
      wheres.push({
        id_user: id_user.id,
      });
    }
    if (id_permission) {
      wheres.push({
        id_permission: id_permission,
      });
    }
    let wheresConcat = {};
    wheresConcat =
      wheres.length && wheres?.reduce((prev, curr) => ({ ...prev, ...curr }));
    const models = await this.repository.find({
      ...(wheres.length && {
        where: wheresConcat || {},
      }),
      order: {
        id_permission: 'ASC', // 'ASC' para ordem crescente, 'DESC' para ordem decrescente
      },
    });
    return models.map((model) => UserPermissionModelMapper.toEntity(model));
  }

  async findAll(): Promise<UserPermission[]> {
    const models = await this.repository.find();
    return models.map((model) => UserPermissionModelMapper.toEntity(model));
  }

  async search(
    props: UserPermissionSearchParams,
  ): Promise<UserPermissionSearchResult> {
    const skip = (props.page - 1) * props.per_page;
    const take = props.per_page;

    const wheres: any[] = [];

    if (
      props.filter &&
      (props.filter.id_contract ||
        props.filter.id_permission ||
        props.filter.id_user)
    ) {
      if (props?.filter?.id_contract) {
        wheres.push({
          id_contract: props.filter.id_contract.id,
        });
      }
      if (props?.filter?.id_permission) {
        wheres.push({
          id_permission: props.filter.id_permission,
        });
      }
      if (props?.filter?.id_user) {
        wheres.push({
          id_user: props.filter.id_user.id,
        });
      }
    }
    let wheresConcat = {};
    wheresConcat =
      wheres.length && wheres?.reduce((prev, curr) => ({ ...prev, ...curr }));

    const [models, count] = await this.repository.findAndCount({
      ...(props.filter && {
        where: wheresConcat || {},
      }),
      skip,
      take,
    });
    return new UserPermissionSearchResult({
      items: models.map((model) => {
        return UserPermissionModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  getEntity(): new (...args: any[]) => UserPermission {
    return UserPermission;
  }
}
