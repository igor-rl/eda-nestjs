import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  IdContract,
  IdUserPermission,
  UserPermission,
} from '../../../../domain/user-permissions.entity';
import { UserPermissionModel } from '../../../../infra/db/typeorm/user-permission.model';
import { UserPermissionTypeOrmRepository } from '../../../../infra/db/typeorm/user-permission.typeorm-repository';
import { DeleteUserPermissionUseCase } from '../delete-user-permission.use-case';
import {
  Contract,
  IdModulo,
} from '../../../../../contrato/domain/contract.entity';
import { ContractModel } from '../../../../../contrato/infra/db/typeorm/contract.model';
import { ContractTypeOrmRepository } from '../../../../../contrato/infra/db/typeorm/contract.typeorm-repository';
import { setupTypeOrmForUserPermission } from '../../../../infra/db/typeorm/testing/helper';

describe('DeleteUserPermissionUseCase integration tests', () => {
  const setup = setupTypeOrmForUserPermission();
  let useCase: DeleteUserPermissionUseCase;
  let userPermissionRepository: UserPermissionTypeOrmRepository;
  let contractRepository: ContractTypeOrmRepository;
  const contract = new Contract({
    id_contract: new IdContract(),
    id_modulo: new IdModulo(),
    modulo_name: 'API_EXAMPLE',
    modulo_active: true,
  });
  beforeEach(async () => {
    const dataSource = setup.dataSource;
    userPermissionRepository = new UserPermissionTypeOrmRepository(
      dataSource.getRepository(UserPermissionModel),
    );
    useCase = new DeleteUserPermissionUseCase(userPermissionRepository);
    contractRepository = new ContractTypeOrmRepository(
      dataSource.getRepository(ContractModel),
    );
    await contractRepository.insert(contract);
  });
  it('Deve retornar erro quando o agregado não existe', async () => {
    const idUserPermission = new IdUserPermission();
    await expect(() =>
      useCase.execute({ id: idUserPermission.id }),
    ).rejects.toThrow(new NotFoundError(idUserPermission.id, UserPermission));
  });
  it('Deve deletar', async () => {
    const entity = UserPermission.fake()
      .anUserPermission()
      .withIdContract(contract.id_contract)
      .build();
    await userPermissionRepository.insert(entity);
    await useCase.execute({ id: entity._id_user_permission.id });
    const noHasUserPermission = await userPermissionRepository.findById(
      entity._id_user_permission,
    );
    expect(noHasUserPermission).toBeNull();
  });
});
