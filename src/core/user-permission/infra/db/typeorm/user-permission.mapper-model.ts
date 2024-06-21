import {
  IdContract,
  IdUser,
  IdUserPermission,
  UserPermission,
} from '../../../domain/user-permissions.entity';
import { UserPermissionModel } from './user-permission.model';

export class UserPermissionModelMapper {
  static toModel(entity: UserPermission): UserPermissionModel {
    return {
      id: entity.id_user_permission.id,
      id_contract: entity.id_contract.id,
      id_user: entity.id_user.id,
      id_permission: entity.id_permission,
      modulo_name: entity.modulo_name,
    };
  }

  static toEntity(model: UserPermissionModel): UserPermission {
    return new UserPermission({
      id_user_permission: new IdUserPermission(model.id),
      id_contract: new IdContract(model.id_contract),
      id_user: new IdUser(model.id_user),
      id_permission: model.id_permission,
      modulo_name: model.modulo_name,
    });
  }
}
