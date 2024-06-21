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
          modulo_active: true,
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
        modulo_active?: boolean;
      };
      expected: {
        id: string;
        id_modulo: string;
        modulo_name: string;
        modulo_active: boolean;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id_contract.id,
          modulo_active: true,
        },
        expected: {
          id: entity.id_contract.id,
          id_modulo: '00000000-0000-0000-0000-000000000000',
          modulo_name: expect.any(String),
          modulo_active: true,
        },
      },
      {
        input: {
          id: entity.id_contract.id,
          modulo_active: false,
        },
        expected: {
          id: entity.id_contract.id,
          id_modulo: '00000000-0000-0000-0000-000000000000',
          modulo_name: expect.any(String),
          modulo_active: false,
        },
      },
    ];
    let output;
    for (const i of arrange) {
      output = await useCase.execute(
        new UpdateContractInput({
          id: i.input.id,
          ...('modulo_name' in i.input && { modulo_name: i.input.modulo_name }),
          ...('modulo_active' in i.input && { modulo_active: i.input.modulo_active }),
        }),
      );
      expect(output).toStrictEqual({
        id: entity.id_contract.id,
        id_modulo: entity.id_modulo.id,
        modulo_name: i.expected.modulo_name,
        modulo_active: i.expected.modulo_active,
      });
    }
  });
});
