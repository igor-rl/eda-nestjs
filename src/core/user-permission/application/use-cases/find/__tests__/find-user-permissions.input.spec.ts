import { validateSync } from 'class-validator';
import { FindUserPermissionsInput } from '../find-user-permissions.input';

describe('FindUserPermissionsInput Unit Tests', () => {
  it('Deve validar FindUserPermissionsInput', () => {
    const input = new FindUserPermissionsInput();
    let errors = validateSync(input);
    expect(errors).toHaveLength(0);
    input.id_contract = '123e4567-e89b-12d3-a456-426614174000';
    input.id_user = '123e4567-e89b-12d3-a456-426614174000';
    input.id_permission = '1';
    errors = validateSync(input);
    expect(errors).toHaveLength(0);
  });
  it('Deve retornar erro ao validar FindUserPermissionsInput', () => {
    const input = new FindUserPermissionsInput();
    input.id_contract = 'invalid-uuid';
    input.id_user = 'invalid-uuid';
    input.id_permission = '-1';
    const errors = validateSync(input);
    expect(errors).toHaveLength(3);
    expect(errors[0].constraints).toMatchObject({
      isUuid: 'id_contract must be a UUID',
    });
    expect(errors[1].constraints).toMatchObject({
      isUuid: 'id_user must be a UUID',
    });
    expect(errors[2].constraints).toMatchObject({
      matches: 'id_permission must be an integer number',
    });
    expect(errors[3]).toBeUndefined();
  });
});
