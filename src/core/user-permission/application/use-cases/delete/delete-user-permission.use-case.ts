import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUserPermissionRepository } from '../../../domain/user-permission-interface.repository';
import { IdUserPermission } from '../../../domain/user-permissions.entity';
import { DeleteUserPermissionInput } from './delete-user-permission.input';

export class DeleteUserPermissionUseCase
  implements IUseCase<DeleteUserPermissionInput, DeleteUserPermissionOutput>
{
  constructor(private readonly repository: IUserPermissionRepository) {}

  async execute(
    input: DeleteUserPermissionInput,
  ): Promise<DeleteUserPermissionOutput> {
    const idUserPermission = new IdUserPermission(input.id_user_permission);
    await this.repository.delete(idUserPermission);
  }
}

type DeleteUserPermissionOutput = void;
