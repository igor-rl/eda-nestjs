import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Contract, IdContract } from '../../../../domain/contract.entity';
import { ContractInMemoryRepository } from '../../../../infra/db/in-memory/contract-in-memory.repository';
import { DeleteContractUseCase } from '../delete-contract.use-case';

describe('DeleteContractUseCase unit tests', () => {
  let useCase: DeleteContractUseCase;
  let repository: ContractInMemoryRepository;
  beforeEach(() => {
    repository = new ContractInMemoryRepository();
    useCase = new DeleteContractUseCase(repository);
    jest.restoreAllMocks();
  });
  it('Deve retornar erro quando o agregado não existir', async () => {
    const idContract = new IdContract();
    await expect(() => useCase.execute({ id: idContract.id })).rejects.toThrow(
      new NotFoundError(idContract.id, Contract),
    );
  });

  it('Deve deletar', async () => {
    const items = [Contract.fake().anContract().build()];
    repository.items = items;
    await useCase.execute({ id: items[0].id_contract.id });
    expect(repository.items).toHaveLength(0);
  });
});
