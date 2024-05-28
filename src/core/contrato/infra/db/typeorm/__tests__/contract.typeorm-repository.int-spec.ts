import { DataSource } from 'typeorm';
import { setupTypeOrmForContract } from '../testing/helper';
import { ContractTypeOrmRepository } from '../contract.typeorm-repository';
import { ContractModel } from '../contract.model';
import { Contract, IdContract } from '../../../../domain/contract.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

describe('ContractTypeORMRepository Integration Tests', () => {
  const setup = setupTypeOrmForContract();
  let dataSource: DataSource;
  let repository: ContractTypeOrmRepository;
  beforeAll(() => {
    dataSource = setup.dataSource;
  });
  beforeEach(async () => {
    repository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
  });
  it('Deve inserir um novo', async () => {
    const entity = Contract.fake().anContract().build();
    await repository.insert(entity);
    const createdContract = await repository.findById(entity.id_contract);
    expect(createdContract!.toJSON()).toStrictEqual(entity.toJSON());
  });
  it('Deve buscar por id', async () => {
    let entityFound = await repository.findById(new IdContract());
    expect(entityFound).toBeNull();
    const entity = Contract.fake().anContract().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.id_contract);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });
  it('Deve retornar erro ao buscar por ids quando não existir', async () => {
    const id = new IdContract();
    await expect(repository.findByIds([id])).resolves.toEqual([]);
  });
  it('Deve retornar todos', async () => {
    const aggregate1 = Contract.fake().anContract().build();
    await repository.insert(aggregate1);
    const entity = await repository.findAll();
    expect(entity).toHaveLength(1);
    expect(aggregate1.toJSON()).toStrictEqual(entity[0].toJSON());
  });
  it('Deve retornar erro no update quando agregado não existe', async () => {
    const aggregate = Contract.fake().anContract().build();
    await expect(repository.update(aggregate)).rejects.toThrow(
      new NotFoundError(aggregate.id_contract, Contract),
    );
  });
  it('Deve fazer o update', async () => {
    const aggregate = Contract.fake().anContract().build();
    await repository.insert(aggregate);
    aggregate.deactivate();
    await repository.update(aggregate);
    const aggregateFound = await repository.findById(aggregate.id_contract);
    expect(aggregateFound!.toJSON()).toStrictEqual(aggregate.toJSON());
  });
  it('Deve retornar erro ao deletar quando agregado não existe', async () => {
    const id = new IdContract();
    await expect(repository.delete(id)).rejects.toThrow(
      new NotFoundError(id.id, Contract),
    );
  });
  it('Deve deletar', async () => {
    const aggregate = Contract.fake().anContract().build();
    await repository.insert(aggregate);
    await repository.delete(aggregate.id_contract);
    expect(repository.findById(aggregate.id_contract)).resolves.toBeNull();
  });
});
