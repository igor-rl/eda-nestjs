import { validateSync } from 'class-validator';
import { CreateUserPermissionInput } from '../create-user-permission.input';
import {
  IdContract,
  IdUser,
  IdUserPermission,
} from '../../../../domain/user-permissions.entity';

describe('CreateUserPermissionInput Unit Tests', () => {
  it('Deve validar CreateUserPermissionInput', () => {
    const input = new CreateUserPermissionInput();
    input.id_user_permission = new IdUserPermission().id;
    input.id_contract = new IdContract().id;
    input.id_user = new IdUser().id;
    input.id_permission = '0';
    input.api_name = 'api1';
    const errors = validateSync(input);
    expect(errors).toHaveLength(0);
  });
  it('Deve retornar erro ao validar CreateUserPermissionInput', () => {
    const input = new CreateUserPermissionInput();
    input.id_user_permission = undefined as any;
    input.id_contract = undefined as any;
    input.id_user = undefined as any;
    input.id_permission = undefined as any;
    input.api_name = undefined as any;

    let errors = validateSync(input);
    expect(errors).toHaveLength(5);
    expect(errors[0].constraints).toMatchObject({
      isNotEmpty: 'id_user_permission should not be empty',
      isUuid: 'id_user_permission must be a UUID',
    });
    expect(errors[1].constraints).toMatchObject({
      isNotEmpty: 'id_contract should not be empty',
      isUuid: 'id_contract must be a UUID',
    });
    expect(errors[2].constraints).toMatchObject({
      isNotEmpty: 'id_user should not be empty',
      isUuid: 'id_user must be a UUID',
    });
    expect(errors[3].constraints).toMatchObject({
      matches: 'id_permission must be an integer number',
    });
    expect(errors[4].constraints).toMatchObject({
      isNotEmpty: 'api_name should not be empty',
    });
    expect(errors[5]).toBeUndefined();

    input.id_user_permission = 'invalid-uuid';
    input.id_contract = 'invalid-uuid';
    input.id_user = 'invalid-uuid';
    input.id_permission = '';
    input.api_name = '';
    errors = validateSync(input);
    expect(errors).toHaveLength(5);
    expect(errors[0].constraints).toMatchObject({
      isUuid: 'id_user_permission must be a UUID',
    });
    expect(errors[1].constraints).toMatchObject({
      isUuid: 'id_contract must be a UUID',
    });
    expect(errors[2].constraints).toMatchObject({
      isUuid: 'id_user must be a UUID',
    });
    expect(errors[3].constraints).toMatchObject({
      matches: 'id_permission must be an integer number',
    });
    expect(errors[4].constraints).toMatchObject({
      isNotEmpty: 'api_name should not be empty',
    });
    expect(errors[5]).toBeUndefined();
  });
});
