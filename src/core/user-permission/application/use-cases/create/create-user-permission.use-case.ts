import { IdContractExistsInDatabaseValidator } from '../../../../contrato/application/validators/contracts-ids-exists-in-database.validator';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { IUserPermissionRepository } from '../../../domain/user-permission-interface.repository';
import {
  IdContract,
  IdUser,
  IdUserPermission,
  UserPermission,
} from '../../../domain/user-permissions.entity';
import { FindUserPermissionsUseCase } from '../find/find-user-permissions.use-case';
import { CreateUserPermissionInput } from './create-user-permission.input';

export class CreateUserPermissionUseCase
  implements IUseCase<CreateUserPermissionInput, Output>
{
  constructor(
    private readonly userPermissionRepository: IUserPermissionRepository,
    private readonly idContractExistsInDatabase: IdContractExistsInDatabaseValidator,
    private readonly findUserPermissionsUseCase: FindUserPermissionsUseCase,
  ) {}

  async execute(input: CreateUserPermissionInput): Promise<void> {
    const id_user_permission = new IdUserPermission(input.id_user_permission);
    const id_contract = new IdContract(input.id_contract);
    const [ids_contract, errorsIdsContracts] = (
      await this.idContractExistsInDatabase.validate([id_contract.id])
    ).asArray();

    const id_user = new IdUser(input.id_user);
    const id_permission = input.id_permission;
    const api_name = input.api_name;
    const aggregate = UserPermission.create({
      id_user_permission,
      id_contract: errorsIdsContracts ? null : ids_contract[0],
      id_user,
      id_permission,
      api_name,
    });
    const user_permission = await this.findUserPermissionsUseCase.execute({
      id_user: id_user.id,
      id_contract: id_contract.id,
      id_permission: id_permission,
    });
    if (user_permission.permissions.length > 0) {
      throw new Error(
        `Usuário '${input.id_user}' do contrato '${input.id_contract}' já possui a permissão ${input.id_permission}`,
      );
    }
    const notification = aggregate.notification;
    if (errorsIdsContracts) {
      notification.setError(
        errorsIdsContracts.map((e) => e.message),
        'id_contract',
      );
    }
    if (aggregate.notification.hasErrors()) {
      throw new EntityValidationError(aggregate.notification.toJSON());
    }
    await this.userPermissionRepository.insert(aggregate);
  }
}

type Output = void;
