import { setupTypeOrmForUserPermission } from '../../../../infra/db/typeorm/testing/helper';
import { CreateUserPermissionUseCase } from '../create-user-permission.use-case';
import { UserPermissionModel } from '../../../../infra/db/typeorm/user-permission.model';
import { CreateUserPermissionInput } from '../create-user-permission.input';
import { UserPermissionTypeOrmRepository } from '../../../../infra/db/typeorm/user-permission.typeorm-repository';
import { IdContractExistsInDatabaseValidator } from '../../../../../contrato/application/validators/contracts-ids-exists-in-database.validator';
import { ContractModel } from '../../../../../contrato/infra/db/typeorm/contract.model';
import { ContractTypeOrmRepository } from '../../../../../contrato/infra/db/typeorm/contract.typeorm-repository';
import {
  IdContract,
  IdUser,
  IdUserPermission,
} from '../../../../domain/user-permissions.entity';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import {
  Contract,
  IdApi,
} from '../../../../../contrato/domain/contract.entity';
import { FindUserPermissionsUseCase } from '../../find/find-user-permissions.use-case';

describe('CreateUserUseCase integration tests', () => {
  const setup = setupTypeOrmForUserPermission();
  let userPermissionRepository: UserPermissionTypeOrmRepository;
  let useCase: CreateUserPermissionUseCase;
  let contractRepository: ContractTypeOrmRepository;
  const contract = new Contract({
    id_contract: new IdContract(),
    id_api: new IdApi(),
    api_name: 'API_EXAMPLE',
    api_active: true,
  });
  beforeEach(async () => {
    const dataSource = setup.dataSource;
    userPermissionRepository = new UserPermissionTypeOrmRepository(
      dataSource.getRepository(UserPermissionModel),
    );
    const idContractExistsInDatabase = new IdContractExistsInDatabaseValidator(
      new ContractTypeOrmRepository(dataSource.getRepository(ContractModel)),
    );
    useCase = new CreateUserPermissionUseCase(
      userPermissionRepository,
      idContractExistsInDatabase,
      new FindUserPermissionsUseCase(userPermissionRepository),
    );
    contractRepository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
    await contractRepository.insert(contract);
  });
  it('Não deve adicionar uma permissão para um usuario se o contrato não existe', async () => {
    const input = new CreateUserPermissionInput();
    input.id_user_permission = new IdUserPermission().id;
    input.id_contract = new IdContract().id;
    input.id_user = new IdUser().id;
    input.id_permission = '0';
    input.api_name = 'api1';
    try {
      await useCase.execute(input);
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect(e.error).toStrictEqual([
        {
          id_contract: [`Contract Not Found using ID ${input.id_contract}`],
        },
      ]);
    }
  });
  it('Deve adicionar uma permissão para um usuario', async () => {
    const input = new CreateUserPermissionInput();
    input.id_user_permission = new IdUserPermission().id;
    input.id_contract = contract.id_contract.id;
    input.id_user = new IdUser().id;
    input.id_permission = '0';
    input.api_name = contract.api_name;
    await useCase.execute(input);
    const results = await userPermissionRepository.findAll();
    expect(results).toHaveLength(1);
    expect(results[0].toJSON()).toStrictEqual({
      id_user_permission: input.id_user_permission,
      id_contract: input.id_contract,
      id_user: input.id_user,
      id_permission: input.id_permission,
      api_name: input.api_name,
    });
  });
  it('Não deve adicionar permissão duplicada para um usuario', async () => {
    const input = new CreateUserPermissionInput();
    input.id_user_permission = new IdUserPermission().id;
    input.id_contract = contract.id_contract.id;
    input.id_user = new IdUser().id;
    input.id_permission = '0';
    input.api_name = contract.api_name;
    await useCase.execute(input);
    await useCase.execute({ ...input, id_permission: '1' });
    console.log(await userPermissionRepository.findAll());
    await expect(useCase.execute(input)).rejects.toThrow(
      `Usuário '${input.id_user}' do contrato '${input.id_contract}' já possui a permissão ${input.id_permission}`,
    );
  });
});
