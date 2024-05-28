import { Contract, IdApi } from '../../../domain/contract.entity';
import { ContractInMemoryRepository } from './contract-in-memory.repository';

describe('ContractInMemoryRepository', () => {
  let repository: ContractInMemoryRepository;
  beforeEach(() => (repository = new ContractInMemoryRepository()));
  const idsApiAccess = new IdApi();
  const itens: Contract[] = [
    Contract.fake().anContract().withIdApi(idsApiAccess).build(),
    Contract.fake().anContract().deactivate().build(),
    Contract.fake().anContract().build(),
  ];
  it('Não deve filtrar quando o objeto de filtro é null', async () => {
    const items = [Contract.fake().anContract().build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);
    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });
  it('Deve filtrar os itens usando os paramentros de filtros', async () => {
    const filterSpy = jest.spyOn(itens, 'filter' as any);
    let itensFiltrados = await repository['applyFilter'](itens, {
      api_not_active: true,
    });
    expect(itensFiltrados).toStrictEqual([itens[1]]);
    itensFiltrados = await repository['applyFilter'](itens, {
      api_active: true,
    });
    expect(itensFiltrados).toStrictEqual([itens[0], itens[2]]);
    expect(filterSpy).toHaveBeenCalledTimes(2);
  });
  it('deve filtrar usando o id_api', async () => {
    const filterSpy = jest.spyOn(itens, 'filter' as any);
    const itensFiltrados = await repository['applyFilter'](itens, {
      id_api: idsApiAccess,
    });
    expect(itensFiltrados.length).toBe(1);
    expect(itensFiltrados).toStrictEqual([itens[0]]);
    expect(filterSpy).toHaveBeenCalledTimes(1);
  });
});
