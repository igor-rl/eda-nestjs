import { Contract } from '../../../domain/contract.entity';
import { ContractOutputMapper } from './contract.output';

describe('ContractOutput Unit Tests', () => {
  it('Deve converter Contract em outputContract', () => {
    const entity = Contract.fake().anContract().build();
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = ContractOutputMapper.toOutput(entity);
    expect(output).toStrictEqual({
      id: entity.id_contract.id,
      id_api: entity.id_api.id,
      api_name: entity.api_name,
      api_active: entity.api_active,
    });
    expect(spyToJSON).toHaveBeenCalled();
  });
});
