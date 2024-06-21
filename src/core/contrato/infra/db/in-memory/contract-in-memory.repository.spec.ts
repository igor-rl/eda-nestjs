import { Contract, IdModulo } from '../../../domain/contract.entity';
import { ContractInMemoryRepository } from './contract-in-memory.repository';

describe('ContractInMemoryRepository', () => {
  let repository: ContractInMemoryRepository;
  beforeEach(() => (repository = new ContractInMemoryRepository()));
  const idsModuloAccess = new IdModulo();
  const itens: Contract[] = [
    Contract.fake().anContract().withIdModulo(idsModuloAccess).build(),
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
      modulo_active: true,
    });
    expect(itensFiltrados).toStrictEqual([itens[0], itens[2]]);
    expect(filterSpy).toHaveBeenCalledTimes(2);
  });
  it('deve filtrar usando o id_modulo', async () => {
    const filterSpy = jest.spyOn(itens, 'filter' as any);
    const itensFiltrados = await repository['applyFilter'](itens, {
      id_modulo: idsModuloAccess,
    });
    expect(itensFiltrados.length).toBe(1);
    expect(itensFiltrados).toStrictEqual([itens[0]]);
    expect(filterSpy).toHaveBeenCalledTimes(1);
  });
});
