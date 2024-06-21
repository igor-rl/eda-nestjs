import { Contract } from '../../../domain/contract.entity';
import { ContractOutputMapper } from './contract.output';

describe('ContractOutput Unit Tests', () => {
  it('Deve converter Contract em outputContract', () => {
    const entity = Contract.fake().anContract().build();
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = ContractOutputMapper.toOutput(entity);
    expect(output).toStrictEqual({
      id: entity.id_contract.id,
      id_modulo: entity.id_modulo.id,
      modulo_name: entity.modulo_name,
      modulo_active: entity.modulo_active,
    });
    expect(spyToJSON).toHaveBeenCalled();
  });
});
