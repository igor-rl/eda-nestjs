import { In, Like, Repository } from 'typeorm';
import {
  ContractSearchParams,
  ContractSearchResult,
  IContractRepository,
} from '../../../domain/contract.repository';
import { ContractModel } from './contract.model';
import { Contract, IdContract } from '../../../domain/contract.entity';
import { ContractModelMapper } from './contract.mapper-model';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument.error';

export class ContractTypeOrmRepository implements IContractRepository {
  sortableFields: string[] = ['api_name'];

  orderBy = {
    api_name: (sort_dir: 'ASC' | 'DESC') => ({ order: { api_name: sort_dir } }),
  };

  constructor(private repository: Repository<ContractModel>) {}

  async insert(aggregate: Contract): Promise<void> {
    const model = ContractModelMapper.toModel(aggregate);
    await this.repository.save(model);
  }

  async bulkInsert(entities: Contract[]): Promise<void> {
    const models = entities.map((entity) =>
      ContractModelMapper.toModel(entity),
    );
    await this.repository.save(models);
  }

  async update(aggregate: Contract): Promise<void> {
    const id = aggregate.id_contract.id;
    const model = ContractModelMapper.toModel(aggregate);
    const { affected } = await this.repository.update(id, model);
    if (affected !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async delete(id_contract: IdContract): Promise<void> {
    const id = id_contract.id;
    const { affected } = await this.repository.delete(id);
    if (affected !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async findByIds(ids_apis: IdContract[]): Promise<Contract[]> {
    const ids = ids_apis.map((id_contract) => id_contract.id);
    const models = await this.repository.find({
      where: {
        id: In(ids),
      },
    });
    return models.map((model) => ContractModelMapper.toEntity(model));
  }

  async existsById(
    ids: IdContract[],
  ): Promise<{ exists: IdContract[]; not_exists: IdContract[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }
    const existsModels = await this.repository.find({
      select: ['id'],
      where: {
        id: In(ids.map((id) => id.id)),
      },
    });
    const existsIds = existsModels.map((model) => new IdContract(model.id));
    const notExistsIds = ids.filter(
      (id) => !existsIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsIds,
      not_exists: notExistsIds,
    };
  }

  async findById(id_contract: IdContract): Promise<Contract> {
    const model = await this.repository.findOneBy({
      id: id_contract.id,
    });
    return model ? ContractModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Contract[]> {
    const models = await this.repository.find();
    return models.map((model) => ContractModelMapper.toEntity(model));
  }

  async search(props: ContractSearchParams): Promise<ContractSearchResult> {
    const skip = (props.page - 1) * props.per_page;
    const take = props.per_page;

    const wheres: any[] = [];

    if (
      props.filter &&
      (props.filter.id_api ||
        props.filter.api_name ||
        props.filter?.api_active ||
        props.filter?.api_not_active)
    ) {
      if (props.filter.id_api) {
        wheres.push({
          id_api: Like(`%${props.filter.id_api}%`),
        });
      }
      if (props.filter.api_name) {
        wheres.push({ api_name: Like(`%${props.filter.api_name}%`) });
      }
      if (props.filter.api_active) {
        wheres.push({ api_active: true });
      }
      if (props.filter.api_not_active) {
        wheres.push({ api_active: false });
      }
    }
    let wheresConcat = {};
    wheresConcat =
      wheres.length && wheres?.reduce((prev, curr) => ({ ...prev, ...curr }));
    const [models, count] = await this.repository.findAndCount({
      ...(props.filter && {
        where: wheresConcat || {},
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: { [props.sort]: props.sort_dir } }
        : { order: { api_name: 'DESC' } }),
      skip,
      take,
    });
    return new ContractSearchResult({
      items: models.map((model) => {
        return ContractModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  getEntity(): new (...args: any[]) => Contract {
    return Contract;
  }
}
