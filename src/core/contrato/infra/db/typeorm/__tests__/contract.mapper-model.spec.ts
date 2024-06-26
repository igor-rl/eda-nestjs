import {
  Contract,
  IdModulo,
  IdContract,
} from '../../../../domain/contract.entity';
import { ContractModelMapper } from '../contract.mapper-model';

describe('ContractModelMapper', () => {
  it('should convert to model', () => {
    const entity = new Contract({
      id_contract: new IdContract('5490020a-e866-4229-9adc-aa44b83234c4'),
      id_modulo: new IdModulo('5490020a-e866-4229-9adc-aa44b83234c4'),
      modulo_name: 'Nome Exemplo',
      modulo_active: true,
    });
    const model = ContractModelMapper.toModel(entity);
    expect(model).toStrictEqual({
      id: '5490020a-e866-4229-9adc-aa44b83234c4',
      id_modulo: '5490020a-e866-4229-9adc-aa44b83234c4',
      modulo_name: 'Nome Exemplo',
      modulo_active: true,
    });
  });
  it('should convert to entity', () => {
    const model = {
      id: '5490020a-e866-4229-9adc-aa44b83234c4',
      id_modulo: '5490020a-e866-4229-9adc-aa44b83234c4',
      modulo_name: 'Nome Exemplo',
      modulo_active: false,
    };
    const entity = ContractModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual({
      id_contract: new IdContract('5490020a-e866-4229-9adc-aa44b83234c4').id,
      id_modulo: new IdModulo('5490020a-e866-4229-9adc-aa44b83234c4').id,
      modulo_name: 'Nome Exemplo',
      modulo_active: false,
    });
  });
});
