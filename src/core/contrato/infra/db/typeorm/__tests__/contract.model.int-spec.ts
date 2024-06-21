import { DataSource, Repository } from 'typeorm';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { ContractModel } from '../contract.model';
import { UserPermissionModel } from '../../../../../user-permission/infra/db/typeorm/user-permission.model';

describe('ContractModel Integration Tests', () => {
  const setup = setupTypeORM({
    entities: [ContractModel, UserPermissionModel],
  });
  let dataSource: DataSource;
  let repository: Repository<ContractModel>;
  let atributesMap: any;
  let modelColumns: string[];

  const apiModelMap = ['id', 'id_modulo', 'modulo_name', 'modulo_active'];
  beforeAll(() => {
    dataSource = setup.dataSource;
    repository = dataSource.getRepository(ContractModel);
    modelColumns = repository.metadata.columns.map(
      (column) => column.propertyName,
    );
    atributesMap = repository.metadata.mapPropertyPathsToColumns(apiModelMap);
  });
  describe('validação das colunas da tabela ContractModel', () => {
    it('deve verificar as colunas da tabela ContractModel são compatíveis', () => {
      expect(modelColumns).toEqual(apiModelMap);
    });
  });
  describe('propriedades que são únicas', () => {
    it('deve validar as propriedades que são únicas', () => {
      const uniques = atributesMap[0].entityMetadata.uniques;
      expect(uniques.length).toBe(0);
    });
  });
  describe('validação das propriedades das colunas', () => {
    it('id', () => {
      const attr = atributesMap[0];
      expect(attr.databaseName).toBe('id');
      expect(attr.isPrimary).toBeTruthy();
      expect(attr.isNullable).toBeFalsy();
      expect(attr.entityMetadata.hasUUIDGeneratedColumns).toBeTruthy();
    });
    it('id_modulo', () => {
      const attr = atributesMap[1];
      expect(attr.databaseName).toBe('id_modulo');
      expect(attr.length).toBe('');
      expect(attr.isPrimary).toBeFalsy();
      expect(attr.isNullable).toBeFalsy();
      expect(attr.type).toBe('uuid');
    });
    it('modulo_name', () => {
      const attr = atributesMap[2];
      expect(attr.databaseName).toBe('modulo_name');
      expect(attr.isPrimary).toBeFalsy();
      expect(attr.isNullable).toBeFalsy();
      expect(new attr.type()).toBeInstanceOf(String);
    });
    it('modulo_active', () => {
      const attr = atributesMap[3];
      expect(attr.databaseName).toBe('modulo_active');
      expect(attr.isPrimary).toBeFalsy();
      expect(attr.isNullable).toBeFalsy();
      expect(new attr.type()).toBeInstanceOf(Boolean);
    });
    it('undefined', () => {
      expect(atributesMap[4]).toBeUndefined();
    });
  });
});
