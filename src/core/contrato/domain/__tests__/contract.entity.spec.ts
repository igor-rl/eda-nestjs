import { Contract, IdApi, IdContract } from '../contract.entity';

describe('Contract entity Unit Tests', () => {
  beforeEach(() => {
    Contract.prototype.validate = jest
      .fn()
      .mockImplementation(Contract.prototype.validate);
  });
  const id_api = new IdApi();
  it('constructor of Contract', () => {
    let contrato = new Contract({
      id_contract: new IdContract(),
      id_api,
      api_name: 'api_name',
    });
    expect(contrato).toBeDefined();
    expect(contrato.id_contract).toBeInstanceOf(IdContract);
    expect(contrato.id_api).toBeInstanceOf(IdApi);
    expect(contrato.api_name).toBe('api_name');
    expect(contrato.api_active).toBe(true);

    contrato = new Contract({
      id_contract: new IdContract(),
      id_api,
      api_name: 'api_name',
    });
    expect(contrato.id_contract).toBeInstanceOf(IdContract);
    expect(contrato.id_api).toBeInstanceOf(IdApi);
    expect(contrato.api_name).toBe('api_name');
    expect(contrato.api_active).toBe(true);
    contrato = new Contract({
      id_contract: new IdContract(),
      id_api,
      api_name: 'api_name',
      api_active: false,
    });
    expect(contrato.api_active).toBe(false);
  });
  describe('Create command', () => {
    it('should create a new contrato', () => {
      const contrato = new Contract({
        id_contract: new IdContract(),
        id_api,
        api_name: 'api_name',
      });
      expect(contrato).toBeDefined();
      expect(contrato.id_contract).toBeInstanceOf(IdContract);
      expect(contrato.id_api).toBeInstanceOf(IdApi);
      expect(contrato.api_name).toBe('api_name');
      expect(contrato.api_active).toBe(true);
    });
    it('should create a contrato with active false', () => {
      const contrato = Contract.create({
        id_contract: new IdContract(),
        id_api,
        api_name: 'api_name',
        api_active: false,
      });
      expect(contrato).toBeDefined();
      expect(contrato.id_contract).toBeInstanceOf(IdContract);
      expect(contrato.id_api).toBeInstanceOf(IdApi);
      expect(contrato.api_name).toBe('api_name');
      expect(contrato.api_active).toBe(false);
    });
  });
});
