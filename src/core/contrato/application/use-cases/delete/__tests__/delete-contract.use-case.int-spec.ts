import { DataSource } from 'typeorm';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { ContractModel } from '../../../../infra/db/typeorm/contract.model';
import { DeleteContractUseCase } from '../delete-contract.use-case';
import { ContractTypeOrmRepository } from '../../../../infra/db/typeorm/contract.typeorm-repository';
import { Contract, IdContract } from '../../../../domain/contract.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

describe('DeleteContractUseCase integration tests', () => {
  const setup = setupTypeORM({ entities: [ContractModel] });
  let dataSource: DataSource;
  let useCase: DeleteContractUseCase;
  let repository: ContractTypeOrmRepository;
  beforeEach(async () => {
    dataSource = setup.dataSource;
    repository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
    useCase = new DeleteContractUseCase(repository);
    jest.restoreAllMocks();
  });
  it('Deve retornar erro quando o agregado não existe', async () => {
    const idContract = new IdContract();
    await expect(() => useCase.execute({ id: idContract.id })).rejects.toThrow(
      new NotFoundError(idContract.id, Contract),
    );
  });
  it('Deve deletar o api', async () => {
    const api = Contract.fake().anContract().build();
    await repository.insert(api);
    await useCase.execute({ id: api.id_contract.id });
    const noHasContract = await repository.findById(api.id_contract);
    expect(noHasContract).toBeNull();
  });
});
