import { DataSource } from 'typeorm';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { IdContract, Contract } from '../../../../domain/contract.entity';
import { ContractModel } from '../../../../infra/db/typeorm/contract.model';
import { ContractTypeOrmRepository } from '../../../../infra/db/typeorm/contract.typeorm-repository';
import { UpdateContractInput } from '../update-contract.input';
import { UpdateContractUseCase } from '../update-contract.use-case';

describe('UpdateContractUseCase integration Tests', () => {
  const setup = setupTypeORM({ entities: [ContractModel] });
  let dataSource: DataSource;
  let useCase: UpdateContractUseCase;
  let repository: ContractTypeOrmRepository;
  beforeEach(() => {
    dataSource = setup.dataSource;
    repository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
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
    await repository.insert(entity);
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
          api_name: entity.api_name,
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
          api_name: entity.api_name,
          api_active: false,
        },
      },
    ];
    let output: any;
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
