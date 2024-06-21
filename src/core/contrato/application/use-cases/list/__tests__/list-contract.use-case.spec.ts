import { IdModulo } from '../../../../../modulos/domain/api.entity';
import { Contract } from '../../../../domain/contract.entity';
import { ContractSearchResult } from '../../../../domain/contract.repository';
import { ContractInMemoryRepository } from '../../../../infra/db/in-memory/contract-in-memory.repository';
import { ContractOutputMapper } from '../../@common/contract.output';
import { ListContractsUseCase } from '../list-contract.use-case';

describe('ListContractsUseCase Unit Tests', () => {
  let useCase: ListContractsUseCase;
  let repository: ContractInMemoryRepository;
  const created_at = new Date();
  const idModulo = new IdModulo();
  const idModulo2 = new IdModulo();
  const items = [
    Contract.fake()
      .anContract()
      .withName('test')
      .addIdModuloAccess(idModulo2)
      .deactivate()
      .build(),
    Contract.fake()
      .anContract()
      .withName('a')
      .deactivate()
      .addIdModuloAccess(idModulo)
      .withCreatedAt(created_at)
      .build(),
    Contract.fake()
      .anContract()
      .withName('TEST')
      .withCreatedAt(created_at)
      .build(),
    Contract.fake()
      .anContract()
      .withName('TeSt')
      .withCreatedAt(created_at)
      .addIdModuloAccess(idModulo2)
      .build(),
  ];
  beforeEach(() => {
    repository = new ContractInMemoryRepository();
    useCase = new ListContractsUseCase(repository);
    jest.restoreAllMocks();
  });
  it('toOutput method', () => {
    let result = new ContractSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
    const entity = Contract.fake().anContract().build();
    result = new ContractSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(ContractOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });
  it('Deve buscar por created_at quando input params é vazio', async () => {
    const items = [
      Contract.fake().anContract().build(),
      Contract.fake()
        .anContract()
        .withCreatedAt(new Date(new Date().getTime() + 100))
        .build(),
    ];
    repository.items = items;
    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(ContractOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });
  it('Deve buscar por paginação e por nome', async () => {
    await repository.bulkInsert(items);
    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'nome',
        },
        output: {
          items: [items[0], items[1]].map(ContractOutputMapper.toOutput),
          total: 4,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          filter: { is_active: false },
        },
        output: {
          items: [items[0], items[1]].map(ContractOutputMapper.toOutput),
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

  it('id_modulo', async () => {
    repository.items = items;
    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          filter: { id_modulo: new IdModulo().id },
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
          filter: { id_modulo: idModulo.id },
        },
        output: {
          items: [items[1]].map(ContractOutputMapper.toOutput),
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
          filter: { id_modulo: idModulo2.id },
        },
        output: {
          items: [items[0], items[3]].map(ContractOutputMapper.toOutput),
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
