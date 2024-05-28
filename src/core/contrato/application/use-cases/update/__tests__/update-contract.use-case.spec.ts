import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { IdContract, Contract } from '../../../../domain/contract.entity';
import { ContractInMemoryRepository } from '../../../../infra/db/in-memory/contract-in-memory.repository';
import { UpdateContractInput } from '../update-contract.input';
import { UpdateContractUseCase } from '../update-contract.use-case';

describe('UpdateContractUseCase unit tests', () => {
  let useCase: UpdateContractUseCase;
  let repository: ContractInMemoryRepository;
  beforeEach(() => {
    repository = new ContractInMemoryRepository();
    useCase = new UpdateContractUseCase(repository);
    jest.restoreAllMocks();
  });
  it('Deve retornar erro quando o agregado não existir', async () => {
    const idContract = new IdContract();
    await expect(() =>
      useCase.execute(
        new UpdateContractInput({
          id: idContract.id,
          api_active: true,
        }),
      ),
    ).rejects.toThrow(new NotFoundError(idContract.id, Contract));
  });
  it('Deve fazer o update do usuario', async () => {
    const entity = Contract.fake().anContract().build();
    repository.items = [entity];
    type Arrange = {
      input: {
        id: string;
        api_active?: boolean;
      };
      expected: {
        id: string;
        id_api: string;
        api_name: string;
        api_active: boolean;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id_contract.id,
          api_active: true,
        },
        expected: {
          id: entity.id_contract.id,
          id_api: '00000000-0000-0000-0000-000000000000',
          api_name: expect.any(String),
          api_active: true,
        },
      },
      {
        input: {
          id: entity.id_contract.id,
          api_active: false,
        },
        expected: {
          id: entity.id_contract.id,
          id_api: '00000000-0000-0000-0000-000000000000',
          api_name: expect.any(String),
          api_active: false,
        },
      },
    ];
    let output;
    for (const i of arrange) {
      output = await useCase.execute(
        new UpdateContractInput({
          id: i.input.id,
          ...('api_name' in i.input && { api_name: i.input.api_name }),
          ...('api_active' in i.input && { api_active: i.input.api_active }),
        }),
      );
      expect(output).toStrictEqual({
        id: entity.id_contract.id,
        id_api: entity.id_api.id,
        api_name: i.expected.api_name,
        api_active: i.expected.api_active,
      });
    }
  });
});
