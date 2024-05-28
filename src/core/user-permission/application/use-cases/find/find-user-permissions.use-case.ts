import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUserPermissionRepository } from '../../../domain/user-permission-interface.repository';
import { IdContract, IdUser } from '../../../domain/user-permissions.entity';
import { FindUserPermissionsInput } from './find-user-permissions.input';

export class FindUserPermissionsUseCase
  implements IUseCase<FindUserPermissionsInput, FindUserPermissionsOutput>
{
  constructor(private readonly repository: IUserPermissionRepository) {}

  async execute(
    input: FindUserPermissionsInput,
  ): Promise<FindUserPermissionsOutput> {
    const id_contract = input?.id_contract && new IdContract(input.id_contract);
    const id_user = input?.id_user && new IdUser(input.id_user);
    const id_permission = input?.id_permission && input.id_permission;
    const results = await this.repository.find({
      id_contract,
      id_user,
      id_permission,
    });
    const idsDePermissao: string[] = results.map(
      (user_permission) => user_permission.id_permission,
    );
    return { permissions: idsDePermissao };
  }
}

export type FindUserPermissionsOutput = {
  permissions: string[];
};
