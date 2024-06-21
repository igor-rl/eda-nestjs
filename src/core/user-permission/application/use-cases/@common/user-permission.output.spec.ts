import {
  IdContract,
  IdUser,
  IdUserPermission,
  UserPermission,
} from '../../../domain/user-permissions.entity';
import { UserPermissionOutputMapper } from './user-permission.output';

describe('UserPermissionOutput Unit Tests', () => {
  it('Deve converter UserPermission em UserPermissionOutput', () => {
    const aggregate = new UserPermission({
      id_user_permission: new IdUserPermission(),
      id_contract: new IdContract(),
      id_user: new IdUser(),
      id_permission: '0',
      modulo_name: 'api1',
    });
    const output = UserPermissionOutputMapper.toOutput(aggregate);
    expect(output).toStrictEqual({
      id: aggregate.id_user_permission.id,
      id_contract: aggregate.id_contract.id,
      id_user: aggregate.id_user.id,
      id_permission: aggregate.id_permission,
      nome_api: aggregate.modulo_name,
    });
  });
});
