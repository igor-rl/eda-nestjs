import { Contract, IdModulo, IdContract } from '../contract.entity';

describe('Contract entity Unit Tests', () => {
  beforeEach(() => {
    Contract.prototype.validate = jest
      .fn()
      .mockImplementation(Contract.prototype.validate);
  });
  const id_modulo = new IdModulo();
  it('constructor of Contract', () => {
    let contrato = new Contract({
      id_contract: new IdContract(),
      id_modulo,
      modulo_name: 'modulo_name',
    });
    expect(contrato).toBeDefined();
    expect(contrato.id_contract).toBeInstanceOf(IdContract);
    expect(contrato.id_modulo).toBeInstanceOf(IdModulo);
    expect(contrato.modulo_name).toBe('modulo_name');
    expect(contrato.modulo_active).toBe(true);

    contrato = new Contract({
      id_contract: new IdContract(),
      id_modulo,
      modulo_name: 'modulo_name',
    });
    expect(contrato.id_contract).toBeInstanceOf(IdContract);
    expect(contrato.id_modulo).toBeInstanceOf(IdModulo);
    expect(contrato.modulo_name).toBe('modulo_name');
    expect(contrato.modulo_active).toBe(true);
    contrato = new Contract({
      id_contract: new IdContract(),
      id_modulo,
      modulo_name: 'modulo_name',
      modulo_active: false,
    });
    expect(contrato.modulo_active).toBe(false);
  });
  describe('Create command', () => {
    it('should create a new contrato', () => {
      const contrato = new Contract({
        id_contract: new IdContract(),
        id_modulo,
        modulo_name: 'modulo_name',
      });
      expect(contrato).toBeDefined();
      expect(contrato.id_contract).toBeInstanceOf(IdContract);
      expect(contrato.id_modulo).toBeInstanceOf(IdModulo);
      expect(contrato.modulo_name).toBe('modulo_name');
      expect(contrato.modulo_active).toBe(true);
    });
    it('should create a contrato with active false', () => {
      const contrato = Contract.create({
        id_contract: new IdContract(),
        id_modulo,
        modulo_name: 'modulo_name',
        modulo_active: false,
      });
      expect(contrato).toBeDefined();
      expect(contrato.id_contract).toBeInstanceOf(IdContract);
      expect(contrato.id_modulo).toBeInstanceOf(IdModulo);
      expect(contrato.modulo_name).toBe('modulo_name');
      expect(contrato.modulo_active).toBe(false);
    });
  });
});
