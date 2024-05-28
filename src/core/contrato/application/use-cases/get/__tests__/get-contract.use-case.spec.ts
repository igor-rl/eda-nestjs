import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { IdContract, Contract } from '../../../../domain/contract.entity';
import { ContractInMemoryRepository } from '../../../../infra/db/in-memory/contract-in-memory.repository';
import { GetContractUseCase } from '../get-contract.use-case';

describe('GetContractUseCase unit tests', () => {
  let useCase: GetContractUseCase;
  let repository: ContractInMemoryRepository;
  beforeEach(() => {
    repository = new ContractInMemoryRepository();
    useCase = new GetContractUseCase(repository);
    jest.restoreAllMocks();
  });
  it('Deve retornar erro quando o agregado não existir', async () => {
    const idContract = new IdContract();
    await expect(() => useCase.execute({ id: idContract.id })).rejects.toThrow(
      new NotFoundError(idContract.id, Contract),
    );
  });
  it('Deve retornar', async () => {
    const items = [Contract.fake().anContract().build()];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    await useCase.execute({ id: items[0].id_contract.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(1);
    expect(repository.items[0].id_contract.id).toBe(items[0].id_contract.id);
  });
});
