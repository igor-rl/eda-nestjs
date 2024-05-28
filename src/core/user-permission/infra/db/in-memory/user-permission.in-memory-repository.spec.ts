import {
  UserPermission,
  IdContract,
  IdUser,
  IdUserPermission,
} from '../../../domain/user-permissions.entity';
import { UserPermissionInMemoryRepository } from './user-permission.in-memory-repository';

describe('UserPermissionInMemoryRepository', () => {
  let repository: UserPermissionInMemoryRepository;
  beforeEach(() => (repository = new UserPermissionInMemoryRepository()));
  it('Não deve filtrar quando o objeto de filtro é null', async () => {
    const items = [
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract: new IdContract(),
        id_user: new IdUser(),
        id_permission: '1',
        api_name: 'api1',
      }),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);
    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });
  describe('filtros', () => {
    const user1 = new IdUser();
    const user2 = new IdUser();
    const itens = [
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract: new IdContract(),
        id_user: user1,
        id_permission: '1',
        api_name: 'api1',
      }),
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract: new IdContract(),
        id_user: user1,
        id_permission: '2',
        api_name: 'api2',
      }),
      UserPermission.create({
        id_user_permission: new IdUserPermission(),
        id_contract: new IdContract(),
        id_user: user2,
        id_permission: '2',
        api_name: 'api2',
      }),
    ];
    it('Deve filtrar os itens usando os paramentros de filtros unicos', async () => {
      const filterSpy = jest.spyOn(itens, 'filter' as any);
      let itensFiltrados = await repository['applyFilter'](itens, {
        id_permission: '1',
      });
      expect(itensFiltrados).toStrictEqual([itens[0]]);

      itensFiltrados = await repository['applyFilter'](itens, {
        id_permission: '2',
      });
      expect(itensFiltrados).toStrictEqual([itens[1], itens[2]]);

      itensFiltrados = await repository['applyFilter'](itens, {
        id_user: user1,
      });
      expect(itensFiltrados).toStrictEqual([itens[0], itens[1]]);

      itensFiltrados = await repository['applyFilter'](itens, {
        id_user: user1,
        id_permission: '2',
      });
      expect(itensFiltrados).toStrictEqual([itens[1]]);

      itensFiltrados = await repository['applyFilter'](itens, {
        api_name: 'api1',
      });
      expect(itensFiltrados).toStrictEqual([itens[0]]);

      itensFiltrados = await repository['applyFilter'](itens, {
        api_name: 'api2',
      });
      expect(itensFiltrados).toStrictEqual([itens[1], itens[2]]);

      expect(filterSpy).toHaveBeenCalledTimes(6);
    });
  });
});
