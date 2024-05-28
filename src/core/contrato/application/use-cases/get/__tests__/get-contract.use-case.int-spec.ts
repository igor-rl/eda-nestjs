import { DataSource } from 'typeorm';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { IdContract, Contract } from '../../../../domain/contract.entity';
import { ContractModel } from '../../../../infra/db/typeorm/contract.model';
import { ContractTypeOrmRepository } from '../../../../infra/db/typeorm/contract.typeorm-repository';
import { GetContractUseCase } from '../get-contract.use-case';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

describe('GetContractUseCase integration tests', () => {
  const setup = setupTypeORM({ entities: [ContractModel] });
  let dataSource: DataSource;
  let useCase: GetContractUseCase;
  let repository: ContractTypeOrmRepository;
  beforeEach(async () => {
    dataSource = setup.dataSource;
    repository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
    useCase = new GetContractUseCase(repository);
    jest.restoreAllMocks();
  });
  it('Deve retornar erro quando o agregado não existir', async () => {
    const idContract = new IdContract();
    await expect(() => useCase.execute({ id: idContract.id })).rejects.toThrow(
      new NotFoundError(idContract.id, Contract),
    );
  });
  it('Deve retornar um register', async () => {
    const register = Contract.fake().anContract().build();
    await repository.insert(register);
    const output = await useCase.execute({ id: register.id_contract!.id });
    expect(output).toStrictEqual({
      id: register.id_contract!.id,
      id_api: register.id_api!.id,
      api_name: register.api_name,
      api_active: register.api_active,
    });
  });
});
