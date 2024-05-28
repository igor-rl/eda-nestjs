import { validateSync } from 'class-validator';
import { UpdateContractInput } from '../update-contract.input';

describe('UpdateContractInput Unit Tests', () => {
  it('Deve validar UpdateContractInput', () => {
    const input = new UpdateContractInput();
    input.id = '550e8400-e29b-41d4-a716-446655440000';
    input.api_active = true;
    const errors = validateSync(input);
    expect(errors).toHaveLength(0);
  });
  it('Deve retornar erro ao validar UpdateContractInput', () => {
    const input = new UpdateContractInput();
    input.id = undefined;
    input.api_active = 'tipo-inválido' as unknown as boolean;
    const errors = validateSync(input);
    expect(errors).toHaveLength(2);
    expect(errors[0].constraints).toMatchObject({
      isNotEmpty: 'id should not be empty',
      isUuid: 'id must be a UUID',
    });
    expect(errors[1].constraints).toMatchObject({
      isBoolean: 'api_active must be a boolean value',
    });
    expect(errors[2]).toBeUndefined();
  });
});
