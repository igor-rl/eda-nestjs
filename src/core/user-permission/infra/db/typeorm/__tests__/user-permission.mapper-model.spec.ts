import {
  IdContract,
  IdUser,
  IdUserPermission,
  UserPermission,
} from '../../../../domain/user-permissions.entity';
import { UserPermissionModelMapper } from '../user-permission.mapper-model';

describe('UserPermissionModelMapper Integration Test', () => {
  it('Deve converter entity para model', () => {
    const entity = UserPermission.create({
      id_user_permission: new IdUserPermission(),
      id_contract: new IdContract(),
      id_permission: '1',
      id_user: new IdUser(),
      modulo_name: 'api1',
    });
    const model = UserPermissionModelMapper.toModel(entity);
    expect(model).toEqual({
      id: entity.id_user_permission.id,
      id_contract: entity.id_contract.id,
      id_user: entity.id_user.id,
      id_permission: entity.id_permission,
      modulo_name: entity.modulo_name,
    });
  });
  it('Deve converter model para entity', () => {
    const model = {
      id: '5490020a-e866-4229-9adc-aa44b83234c4',
      id_contract: '5490020a-e866-4229-9adc-aa44b83234c4',
      id_user: '5490020a-e866-4229-9adc-aa44b83234c4',
      id_permission: '1',
      modulo_name: 'api1',
    };
    const entity = UserPermissionModelMapper.toEntity(model);
    expect(entity.toJSON()).toEqual({
      id_user_permission: model.id,
      id_contract: model.id_contract,
      id_user: model.id_user,
      id_permission: model.id_permission,
      modulo_name: model.modulo_name,
    });
  });
});
