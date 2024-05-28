import { setupTypeOrmForUserPermission } from '../../../../infra/db/typeorm/testing/helper';
import { UserPermissionTypeOrmRepository } from '../../../../infra/db/typeorm/user-permission.typeorm-repository';
import { FindUserPermissionsUseCase } from '../find-user-permissions.use-case';
import { UserPermissionModel } from '../../../../infra/db/typeorm/user-permission.model';
import {
  IdContract,
  IdUser,
  IdUserPermission,
  UserPermission,
} from '../../../../domain/user-permissions.entity';
import {
  Contract,
  IdApi,
} from '../../../../../contrato/domain/contract.entity';
import { ContractModel } from '../../../../../contrato/infra/db/typeorm/contract.model';
import { ContractTypeOrmRepository } from '../../../../../contrato/infra/db/typeorm/contract.typeorm-repository';

describe('FindUserPermissionsUseCase integration tests', () => {
  const setup = setupTypeOrmForUserPermission();
  let repository: UserPermissionTypeOrmRepository;
  let useCase: FindUserPermissionsUseCase;
  let contractRepository: ContractTypeOrmRepository;
  const contract = new Contract({
    id_contract: new IdContract(),
    id_api: new IdApi(),
    api_name: 'API_EXAMPLE',
    api_active: true,
  });
  const contract2 = new Contract({
    ...contract,
    id_contract: new IdContract(),
  });
  beforeEach(async () => {
    const dataSource = setup.dataSource;
    repository = new UserPermissionTypeOrmRepository(
      dataSource.getRepository(UserPermissionModel),
    );
    useCase = new FindUserPermissionsUseCase(repository);
    contractRepository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
    await contractRepository.insert(contract);
    await contractRepository.insert(contract2);
  });
  it('Deve filtrar apenas as permissões de um usuário', async () => {
    const id_user_a = new IdUser();
    const id_user_b = new IdUser();
    const id_contract = contract.id_contract;
    const aggregates = [
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract,
        id_user: id_user_a,
        id_permission: '2',
        api_name: 'EX_ONLINE',
      }),
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract,
        id_user: id_user_a,
        id_permission: '1',
        api_name: 'EX_ONLINE',
      }),
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract: contract2.id_contract,
        id_user: id_user_b,
        id_permission: '3',
        api_name: 'EX_ONLINE',
      }),
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract,
        id_user: id_user_b,
        id_permission: '0',
        api_name: 'EX_ONLINE',
      }),
    ];
    await repository.bulkInsert(aggregates);
    let permissions = await useCase.execute({ id_user: new IdUser().id });
    expect(permissions.permissions).toEqual([]);
    permissions = await useCase.execute({ id_user: id_user_a.id });
    expect(permissions.permissions).toEqual(['1', '2']);
    permissions = await useCase.execute({ id_user: id_user_b.id });
    expect(permissions.permissions).toEqual(['0', '3']);
    permissions = await useCase.execute({
      id_user: id_user_b.id,
      id_contract: id_contract.id,
    });
    expect(permissions.permissions).toEqual(['0']);
    permissions = await useCase.execute({
      id_user: id_user_b.id,
      id_contract: id_contract.id,
      id_permission: '0',
    });
    expect(permissions.permissions).toEqual(['0']);
    permissions = await useCase.execute({
      id_user: id_user_b.id,
      id_contract: id_contract.id,
      id_permission: '1',
    });
    expect(permissions.permissions).toEqual([]);
  });
});
