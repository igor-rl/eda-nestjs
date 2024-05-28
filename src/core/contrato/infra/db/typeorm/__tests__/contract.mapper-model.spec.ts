import {
  Contract,
  IdApi,
  IdContract,
} from '../../../../domain/contract.entity';
import { ContractModelMapper } from '../contract.mapper-model';

describe('ContractModelMapper', () => {
  it('should convert to model', () => {
    const entity = new Contract({
      id_contract: new IdContract('5490020a-e866-4229-9adc-aa44b83234c4'),
      id_api: new IdApi('5490020a-e866-4229-9adc-aa44b83234c4'),
      api_name: 'Nome Exemplo',
      api_active: true,
    });
    const model = ContractModelMapper.toModel(entity);
    expect(model).toStrictEqual({
      id: '5490020a-e866-4229-9adc-aa44b83234c4',
      id_api: '5490020a-e866-4229-9adc-aa44b83234c4',
      api_name: 'Nome Exemplo',
      api_active: true,
    });
  });
  it('should convert to entity', () => {
    const model = {
      id: '5490020a-e866-4229-9adc-aa44b83234c4',
      id_api: '5490020a-e866-4229-9adc-aa44b83234c4',
      api_name: 'Nome Exemplo',
      api_active: false,
    };
    const entity = ContractModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual({
      id_contract: new IdContract('5490020a-e866-4229-9adc-aa44b83234c4').id,
      id_api: new IdApi('5490020a-e866-4229-9adc-aa44b83234c4').id,
      api_name: 'Nome Exemplo',
      api_active: false,
    });
  });
});
