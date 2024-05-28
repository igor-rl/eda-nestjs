import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Contract, IdContract } from '../../domain/contract.entity';
import { ContractInMemoryRepository } from '../../infra/db/in-memory/contract-in-memory.repository';
import { IdContractExistsInDatabaseValidator } from './contracts-ids-exists-in-database.validator';

describe('ContractsIdsExistsInDatabaseValidator', () => {
  let repositorio: ContractInMemoryRepository;
  let validator: IdContractExistsInDatabaseValidator;
  beforeEach(() => {
    repositorio = new ContractInMemoryRepository();
    validator = new IdContractExistsInDatabaseValidator(repositorio);
  });
  it('should return many not found error when idContract is not exists in storage', async () => {
    const idContract1 = new IdContract();
    const idContract2 = new IdContract();
    const spyExistsById = jest.spyOn(repositorio, 'existsById');
    let [idsContract, errorsIdsContract] = await validator.validate([
      idContract1.id,
      idContract2.id,
    ]);
    expect(idsContract).toStrictEqual(null);
    expect(errorsIdsContract).toHaveLength(2);
    expect(errorsIdsContract).toStrictEqual([
      new NotFoundError(idContract1.id, Contract),
      new NotFoundError(idContract2.id, Contract),
    ]);
    expect(spyExistsById).toHaveBeenCalledTimes(1);
    const group1 = Contract.fake().anContract().build();
    await repositorio.insert(group1);
    [idsContract, errorsIdsContract] = await validator.validate([
      group1.id_contract.id,
      idContract2.id,
    ]);
    expect(idsContract).toStrictEqual(null);
    expect(errorsIdsContract).toHaveLength(1);
    expect(errorsIdsContract).toStrictEqual([
      new NotFoundError(idContract2.id, Contract),
    ]);
    expect(spyExistsById).toHaveBeenCalledTimes(2);
  });
  it('deve retornar uma lista de ids group', async () => {
    const group1 = Contract.fake().anContract().build();
    const group2 = Contract.fake().anContract().build();
    await repositorio.bulkInsert([group1, group2]);
    const spyExistsById = jest.spyOn(repositorio, 'existsById');
    const [idsContract, errorsIdsContract] = await validator.validate([
      group1.id_contract.id,
      group2.id_contract.id,
    ]);
    expect(idsContract).toHaveLength(2);
    expect(errorsIdsContract).toStrictEqual(null);
    expect(spyExistsById).toHaveBeenCalledTimes(1);
    expect(idsContract[0]).toBeValueObject(group1.id_contract);
    expect(idsContract[1]).toBeValueObject(group2.id_contract);
  });
});
