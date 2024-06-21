import { ContractInMemoryRepository } from '../../../../infra/db/in-memory/contract-in-memory.repository';
import { CreateContractUseCase } from '../create-contract.use-case';

describe('CreateContractUseCase Unit Tests', () => {
  let useCase: CreateContractUseCase;
  let repository: ContractInMemoryRepository;
  beforeEach(() => {
    repository = new ContractInMemoryRepository();
    useCase = new CreateContractUseCase(repository);
    jest.restoreAllMocks();
  });
  describe('Executar meyhodo', () => {
    it('deve retornar um erro genérico', async () => {
      const expectedError = new Error('Erro genérico');
      jest.spyOn(repository, 'insert').mockRejectedValue(expectedError);
      await expect(
        useCase.execute({
          id_contract: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
          id_modulo: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
          modulo_name: 'Teste',
        }),
      ).rejects.toThrow(expectedError);
    });

    it('deve criar um usuario', async () => {
      const spyInsert = jest.spyOn(repository, 'insert');
      const output = await useCase.execute({
        id_contract: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
        id_modulo: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
        modulo_name: 'Teste',
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
        id_modulo: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
        modulo_name: 'Teste',
        modulo_active: true,
      });
    });
  });
});
