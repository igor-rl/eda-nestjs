import { DataSource } from 'typeorm';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { IdUser } from '../../../../../usuario/domain/usuario.aggregate';
import { Contract } from '../../../../domain/contract.entity';
import { ContractModel } from '../../../../infra/db/typeorm/contract.model';
import { ContractTypeOrmRepository } from '../../../../infra/db/typeorm/contract.typeorm-repository';
import { ContractOutputMapper } from '../../@common/contract.output';
import { ListContractsUseCase } from '../list-contract.use-case';
import { IdApi } from '../../../../../apis/domain/api.entity';
import { SortDirection } from '../../../../../shared/domain/repository/search-params';

describe('ListContractsUseCase integration tests', () => {
  const setup = setupTypeORM({ entities: [ContractModel] });
  let dataSource: DataSource;
  let useCase: ListContractsUseCase;
  let repository: ContractTypeOrmRepository;
  beforeEach(async () => {
    dataSource = setup.dataSource;
    repository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
    useCase = new ListContractsUseCase(repository);
    jest.restoreAllMocks();
    await repository.bulkInsert(entities);
  });
  const idApi = new IdApi();
  const idApi2 = new IdApi();
  const entities = [
    Contract.fake()
      .anContract()
      .withUserMaster(new IdUser('a8df04bc-4c5c-4427-8307-5b09e5b3327b'))
      .withName('test')
      .withDescription('description')
      .addIdApiAccess(idApi2)
      .withCreatedAt(new Date(new Date().getTime() + 100))
      .deactivate()
      .build(),
    Contract.fake()
      .anContract()
      .withUserMaster(new IdUser('8cf2090a-1e90-4c4d-803b-37c6f692a861'))
      .withName('a')
      .withDescription('description')
      .addIdApiAccess(idApi)
      .withCreatedAt(new Date(new Date().getTime() + 200))
      .build(),
    Contract.fake()
      .anContract()
      .withUserMaster(new IdUser('8cf2090a-1e90-4c4d-803b-37c6f692a861'))
      .withName('TEST')
      .withDescription('description')
      .withCreatedAt(new Date(new Date().getTime() + 300))
      .build(),
    Contract.fake()
      .anContract()
      .withUserMaster(new IdUser('8cf2090a-1e90-4c4d-803b-37c6f692a861'))
      .withName('b')
      .withDescription('description')
      .withCreatedAt(new Date(new Date().getTime() + 400))
      .deactivate()
      .build(),
    Contract.fake()
      .anContract()
      .withUserMaster(new IdUser('a8df04bc-4c5c-4427-8307-5b09e5b3327b'))
      .withName('TeSt')
      .withDescription('description')
      .addIdApiAccess(idApi2)
      .withCreatedAt(new Date(new Date().getTime() + 500))
      .build(),
  ];
  describe('Deve retornar a saída classificada por criated_at quando o parâmetro de entrada estiver vazio', () => {
    const arrange = [
      {
        input: {
          page: 2,
          per_page: 2,
        },
        output: {
          items: [entities[2], entities[1]].map(ContractOutputMapper.toOutput),
          total: 5,
          current_page: 2,
          per_page: 2,
          last_page: 3,
        },
      },
    ];
    it.each(arrange)(
      'when value is $search_params',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
  });
  describe('Deve buscar com filtro por name, sort, is_active e paginação', () => {
    const arrange = [
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
        },
        output: {
          items: [entities[1], entities[3]].map(ContractOutputMapper.toOutput),
          total: 5,
          current_page: 2,
          per_page: 2,
          last_page: 3,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: { is_active: true },
        },
        output: {
          items: [entities[1]].map(ContractOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { is_active: false },
        },
        output: {
          items: [entities[3], entities[0]].map(ContractOutputMapper.toOutput),
          total: 2,
          current_page: 1,
          per_page: 2,
          last_page: 1,
        },
      },
    ];
    it.each(arrange)(
      'when value is $search_params',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
  });
  describe('should search by id_user_master, sort, is_active and pagination', () => {
    const arrange = [
      {
        input: {
          page: 2,
          per_page: 2,
          filter: { id_user_master: '8cf2090a' },
        },
        output: {
          items: [entities[1]].map(ContractOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: { id_user_master: '8cf2090a' },
        },
        output: {
          items: [entities[3]].map(ContractOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          filter: { id_user_master: '8cf2090a', is_active: true },
        },
        output: {
          items: [entities[2], entities[1]].map(ContractOutputMapper.toOutput),
          total: 2,
          current_page: 1,
          per_page: 2,
          last_page: 1,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { id_user_master: '8cf2090a', is_active: true },
        },
        output: {
          items: [entities[2], entities[1]].map(ContractOutputMapper.toOutput),
          total: 2,
          current_page: 1,
          per_page: 2,
          last_page: 1,
        },
      },
      {
        input: {
          page: 1,
          filter: { id_user_master: '8cf2090a', is_active: false },
        },
        output: {
          items: [entities[3]].map(ContractOutputMapper.toOutput),
          total: 1,
          current_page: 1,
          per_page: 15,
          last_page: 1,
        },
      },
    ];
    it.each(arrange)(
      'when value is $search_params',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
  });
  it('id_api', async () => {
    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          filter: { id_api: new IdApi().id },
          sort: 'created_at',
          sort_dir: 'asc' as SortDirection,
        },
        output: {
          items: [].map(ContractOutputMapper.toOutput),
          total: 0,
          current_page: 1,
          per_page: 2,
          last_page: 0,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          filter: { id_api: idApi.id },
          sort: 'created_at',
          sort_dir: 'asc' as SortDirection,
        },
        output: {
          items: [entities[1]].map(ContractOutputMapper.toOutput),
          total: 1,
          current_page: 1,
          per_page: 2,
          last_page: 1,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          filter: { id_api: idApi2.id },
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
        },
        output: {
          items: [entities[4], entities[0]].map(ContractOutputMapper.toOutput),
          total: 2,
          current_page: 1,
          per_page: 2,
          last_page: 1,
        },
      },
    ];
    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output);
    }
  });
});
