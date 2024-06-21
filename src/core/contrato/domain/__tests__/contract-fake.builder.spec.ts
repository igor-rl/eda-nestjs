import { ContractFakeBuilder } from '../contract-fake.builder';
import { IdModulo, IdContract } from '../contract.entity';

describe('ContractFakeBuilder', () => {
  describe('IdContractFakeBuilder property', () => {
    const faker = ContractFakeBuilder.anContract();
    it('withIdContract', () => {
      const idContract = new IdContract();
      const newFaker = faker.withIdContract(idContract);
      expect(newFaker['_id_contract']).toBe(idContract);
      faker.withIdContract(() => idContract);
      //@ts-expect-error _id_group is a callable
      expect(faker['_id_contract']()).toBe(idContract);
      expect(faker.id_contract).toBe(idContract);
    });
    it('should call the factory function when building Contract', () => {
      let mockFactory = jest.fn(() => new IdContract());
      faker.withIdContract(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      const contratoId = new IdContract();
      mockFactory = jest.fn(() => contratoId);
      const fakerMany = ContractFakeBuilder.theContracts(2);
      fakerMany.withIdContract(mockFactory);
      fakerMany.build();
      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].id_contract).toBe(contratoId);
      expect(fakerMany.build()[1].id_contract).toBe(contratoId);
    });
  });
  describe('id_modulo property', () => {
    const faker = ContractFakeBuilder.anContract();
    it('should be empty', () => {
      expect(faker['_id_modulo']).toBeInstanceOf(IdModulo);
    });
    test('withIdModulo', () => {
      const apiId = new IdModulo();
      const $this = faker.withIdModulo(apiId);
      expect($this).toBeInstanceOf(ContractFakeBuilder);
      expect(faker['_id_modulo']).toStrictEqual(apiId);
    });
  });
  describe('Active property', () => {
    const faker = ContractFakeBuilder.anContract();
    it('should be a function', () => {
      expect(typeof faker['_modulo_active']).toBe('function');
    });
    it('activate should set modulo_active', () => {
      const newFaker = faker.activate();
      expect(newFaker).toBeInstanceOf(ContractFakeBuilder);
      expect(newFaker['_modulo_active']).toBe(true);
      faker.activate();
      expect(faker.modulo_active).toBe(true);
    });
    it('deactivate should set modulo_active', () => {
      const newFaker = faker.deactivate();
      expect(newFaker).toBeInstanceOf(ContractFakeBuilder);
      expect(newFaker['_modulo_active']).toBe(false);
      faker.deactivate();
      expect(faker.modulo_active).toBe(false);
    });
  });
});
