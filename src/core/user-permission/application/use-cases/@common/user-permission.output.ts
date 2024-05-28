import { UserPermission } from '../../../domain/user-permissions.entity';

export type UserPermissionOutput = {
  id: string;
  id_contract: string;
  id_user: string;
  id_permission: string;
  nome_api: string;
};

export class UserPermissionOutputMapper {
  static toOutput(entity: UserPermission): UserPermissionOutput {
    return {
      id: entity.id_user_permission.id,
      id_contract: entity.id_contract.id,
      id_user: entity.id_user.id,
      id_permission: entity.id_permission,
      nome_api: entity.api_name,
    };
  }
}
