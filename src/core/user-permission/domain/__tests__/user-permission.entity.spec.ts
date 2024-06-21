import {
  IdContract,
  IdUser,
  IdUserPermission,
  UserPermission,
} from '../user-permissions.entity';

describe('UserPermission Aggregate Unit Tests', () => {
  const entity = {
    id_user_permission: new IdUserPermission(),
    id_contract: new IdContract(),
    id_user: new IdUser(),
    id_permission: '0',
    modulo_name: 'modulo_name',
  };
  describe('Constructor of UserPermission', () => {
    const userPermissions = [
      new UserPermission(entity),
      UserPermission.create(entity),
      UserPermission.fake().anUserPermission().build(),
    ];
    test.each(userPermissions)(
      'should create a new permission',
      (permission) => {
        expect(permission).toBeDefined();
        expect(permission.id_user_permission).toBeInstanceOf(IdUserPermission);
        expect(permission.id_contract).toBeInstanceOf(IdContract);
        expect(permission.id_user).toBeInstanceOf(IdUser);
        expect(typeof permission.id_permission).toBe('string');
        expect(typeof permission.modulo_name).toBe('string');
      },
    );
  });
});
