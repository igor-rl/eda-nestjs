import { ContractFakeBuilder } from '../contract-fake.builder';
import { IdApi, IdContract } from '../contract.entity';

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
  describe('id_api property', () => {
    const faker = ContractFakeBuilder.anContract();
    it('should be empty', () => {
      expect(faker['_id_api']).toBeInstanceOf(IdApi);
    });
    test('withIdApi', () => {
      const apiId = new IdApi();
      const $this = faker.withIdApi(apiId);
      expect($this).toBeInstanceOf(ContractFakeBuilder);
      expect(faker['_id_api']).toStrictEqual(apiId);
    });
  });
  describe('Active property', () => {
    const faker = ContractFakeBuilder.anContract();
    it('should be a function', () => {
      expect(typeof faker['_api_active']).toBe('function');
    });
    it('activate should set api_active', () => {
      const newFaker = faker.activate();
      expect(newFaker).toBeInstanceOf(ContractFakeBuilder);
      expect(newFaker['_api_active']).toBe(true);
      faker.activate();
      expect(faker.api_active).toBe(true);
    });
    it('deactivate should set api_active', () => {
      const newFaker = faker.deactivate();
      expect(newFaker).toBeInstanceOf(ContractFakeBuilder);
      expect(newFaker['_api_active']).toBe(false);
      faker.deactivate();
      expect(faker.api_active).toBe(false);
    });
  });
});
