import { validateSync } from 'class-validator';
import { CreateContractInput } from '../create-contract.input';

describe('CreateContractInput Unit Tests', () => {
  it('Deve validar CreateContractInput', () => {
    const input = new CreateContractInput();
    input.id_contract = '550e8400-e29b-41d4-a716-446655440000';
    input.id_modulo = '550e8400-e29b-41d4-a716-446655440000';
    input.modulo_name = 'Exemplo de modulo_name';
    input.modulo_active = true;
    const errors = validateSync(input);
    expect(errors).toHaveLength(0);
  });
  it('Deve retornar erro ao validar CreateContractInput', () => {
    const input = new CreateContractInput();
    input.id_contract = undefined;
    input.id_modulo = undefined;
    input.modulo_name = undefined;
    input.modulo_active = 'tipo-inválido' as unknown as boolean;
    const errors = validateSync(input);
    expect(errors).toHaveLength(4);
    expect(errors[0].constraints).toMatchObject({
      isNotEmpty: 'id_contract should not be empty',
      isUuid: 'id_contract must be a UUID',
    });
    expect(errors[1].constraints).toMatchObject({
      isNotEmpty: 'id_modulo should not be empty',
      isUuid: 'id_modulo must be a UUID',
    });
    expect(errors[2].constraints).toMatchObject({
      isString: 'modulo_name must be a string',
    });
    expect(errors[3].constraints).toMatchObject({
      isBoolean: 'modulo_active must be a boolean value',
    });
    expect(errors[4]).toBeUndefined();
  });
});
