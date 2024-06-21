import { DataSource, QueryFailedError } from 'typeorm';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UserPermissionTypeOrmRepository } from '../user-permission.typeorm-repository';
import { UserPermissionModel } from '../user-permission.model';
import { setupTypeOrmForUserPermission } from '../testing/helper';
import {
  UserPermissionSearchParams,
  UserPermissionSearchResult,
} from '../../../../domain/user-permission-interface.repository';
import {
  IdUser,
  UserPermission,
  IdUserPermission,
} from '../../../../domain/user-permissions.entity';
import { ContractTypeOrmRepository } from '../../../../../contrato/infra/db/typeorm/contract.typeorm-repository';
import { Contract } from '../../../../../contrato/domain/contract.entity';
import { ContractModel } from '../../../../../contrato/infra/db/typeorm/contract.model';

describe('UserPermissionTypeORMRepository Integration Tests', () => {
  const setup = setupTypeOrmForUserPermission();
  let dataSource: DataSource;
  let userPermissinRepository: UserPermissionTypeOrmRepository;
  let contractRepository: ContractTypeOrmRepository;
  const user_a = new IdUser();
  const user_b = new IdUser();
  const contract = Contract.fake().anContract().build();
  const contract2 = Contract.fake().anContract().build();
  const aggregates = [
    UserPermission.create({
      id_user_permission: new IdUserPermission(),
      id_contract: contract2.id_contract,
      id_user: user_a,
      id_permission: '1',
      modulo_name: 'api1',
    }),
    UserPermission.create({
      id_user_permission: new IdUserPermission(),
      id_contract: contract.id_contract,
      id_user: user_a,
      id_permission: '2',
      modulo_name: 'api2',
    }),
    UserPermission.create({
      id_user_permission: new IdUserPermission(),
      id_contract: contract.id_contract,
      id_user: user_b,
      id_permission: '1',
      modulo_name: 'api2',
    }),
  ];

  beforeAll(() => {
    dataSource = setup.dataSource;
  });

  beforeEach(async () => {
    userPermissinRepository = new UserPermissionTypeOrmRepository(
      dataSource.getRepository(UserPermissionModel),
    );
    contractRepository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
    await contractRepository.bulkInsert([contract, contract2]);
  });

  it('Deve impedir que um usuario tenha uma permissão duplicada', async () => {
    await userPermissinRepository.insert(aggregates[0]);
    await userPermissinRepository.insert(aggregates[1]);
    await userPermissinRepository.insert(aggregates[2]);
    await expect(userPermissinRepository.insert(aggregates[0])).rejects.toThrow(
      new QueryFailedError(
        'INSERT INTO "user-permission" ("id", "id_user", "id_permission") VALUES (?, ?, ?)',
        ['mocked-id', 'mocked-id_user', 'mocked-id_permission'],
        new Error(
          'SQLITE_CONSTRAINT: UNIQUE constraint failed: user-permission.id_contract, user-permission.id_user, user-permission.id_permission',
        ),
      ),
    );
    await expect(userPermissinRepository.insert(aggregates[1])).rejects.toThrow(
      new QueryFailedError(
        'INSERT INTO "user-permission" ("id", "id_user", "id_permission") VALUES (?, ?, ?)',
        ['mocked-id', 'mocked-id_user', 'mocked-id_permission'],
        new Error(
          'SQLITE_CONSTRAINT: UNIQUE constraint failed: user-permission.id_contract, user-permission.id_user, user-permission.id_permission',
        ),
      ),
    );
    await expect(userPermissinRepository.insert(aggregates[2])).rejects.toThrow(
      new QueryFailedError(
        'INSERT INTO "user-permission" ("id", "id_user", "id_permission") VALUES (?, ?, ?)',
        ['mocked-id', 'mocked-id_user', 'mocked-id_permission'],
        new Error(
          'SQLITE_CONSTRAINT: UNIQUE constraint failed: user-permission.id_contract, user-permission.id_user, user-permission.id_permission',
        ),
      ),
    );
  });

  it('Deve inserir um novo', async () => {
    const aggregate = UserPermission.create({
      id_user_permission: new IdUserPermission(),
      id_contract: contract2.id_contract,
      id_user: new IdUser(),
      id_permission: '1',
      modulo_name: 'modulo_name',
    });
    await userPermissinRepository.insert(aggregate);
    const createdUser = await userPermissinRepository.findById(
      aggregate.id_user_permission,
    );
    expect(createdUser!.toJSON()).toStrictEqual(aggregate.toJSON());
  });
  it('Deve inserir em lote', async () => {
    await userPermissinRepository.bulkInsert(aggregates);
    const usuariosFound = await userPermissinRepository.findAll();
    expect(usuariosFound).toHaveLength(3);
    aggregates.forEach((usuario, index) => {
      expect(usuario.toJSON()).toStrictEqual(usuariosFound[index].toJSON());
    });
  });
  it('Deve buscar por id', async () => {
    let aggregateFound = await userPermissinRepository.findById(new IdUser());
    expect(aggregateFound).toBeNull();
    await userPermissinRepository.bulkInsert(aggregates);
    aggregateFound = await userPermissinRepository.findById(
      aggregates[0].id_user_permission,
    );
    expect(aggregates[0].toJSON()).toStrictEqual(aggregateFound!.toJSON());
  });

  it('Deve retornar erro ao buscar por ids quando não existir', async () => {
    const usuarioId = new IdUser();
    await expect(
      userPermissinRepository.findByIds([usuarioId]),
    ).resolves.toEqual([]);
  });

  it('Deve buscar por ids', async () => {
    await userPermissinRepository.bulkInsert(aggregates);

    const usuarios = await userPermissinRepository.findByIds([
      aggregates[0].id_user_permission,
      aggregates[1].id_user_permission,
    ]);
    expect(usuarios).toHaveLength(0);
  });

  it('Deve retornar todos', async () => {
    const aggregate1 = aggregates[0];
    await userPermissinRepository.insert(aggregate1);
    const usuarios = await userPermissinRepository.findAll();
    expect(usuarios).toHaveLength(1);
    expect(aggregate1.toJSON()).toStrictEqual(usuarios[0].toJSON());
  });

  it('Deve retornar erro ao deletar quando agregado não existe', async () => {
    const usuarioId = new IdUser();
    await expect(userPermissinRepository.delete(usuarioId)).rejects.toThrow(
      new NotFoundError(usuarioId.id, UserPermission),
    );
  });

  it('Deve deletar', async () => {
    const aggregate = aggregates[0];
    await userPermissinRepository.insert(aggregate);

    await userPermissinRepository.delete(aggregate.id_user_permission);
    expect(
      userPermissinRepository.findById(aggregate.id_user_permission),
    ).resolves.toBeNull();
  });

  describe('busca', () => {
    it('busca todos', async () => {
      await userPermissinRepository.bulkInsert(aggregates);

      const searchOutput = await userPermissinRepository.search(
        UserPermissionSearchParams.create(),
      );
      expect(searchOutput).toBeInstanceOf(UserPermissionSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 3,
        current_page: 1,
        last_page: 1,
        per_page: 15,
      });
      aggregates.forEach((item, index) => {
        expect(searchOutput.items[index]).toBeInstanceOf(UserPermission);
        expect(item.toJSON()).toStrictEqual(searchOutput.items[index].toJSON());
      });
    });
    it('Deve aplicar a paginação e o filtro pelo nome', async () => {
      await userPermissinRepository.bulkInsert(aggregates);
      let searchOutput = await userPermissinRepository.search(
        UserPermissionSearchParams.create({
          page: 1,
          per_page: 2,
          filter: { id_user: user_a.id },
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new UserPermissionSearchResult({
          items: [aggregates[0], aggregates[1]],
          total: 2,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      );
      searchOutput = await userPermissinRepository.search(
        UserPermissionSearchParams.create({
          page: 1,
          per_page: 2,
          filter: { id_user: user_a.id, id_permission: '1' },
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new UserPermissionSearchResult({
          items: [aggregates[0]],
          total: 1,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      );
    });
  });
});
