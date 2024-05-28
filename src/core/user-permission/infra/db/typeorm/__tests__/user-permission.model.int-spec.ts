import { DataSource, Repository } from 'typeorm';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { UserPermissionModel } from '../user-permission.model';
import { ContractModel } from '../../../../../contrato/infra/db/typeorm/contract.model';

describe('UserPermissionModel Integration Tests', () => {
  const setup = setupTypeORM({
    entities: [UserPermissionModel, ContractModel],
  });
  let dataSource: DataSource;
  let repository: Repository<UserPermissionModel>;
  let atributesMap: any;
  let enterpriseModelColumns: string[];

  const modelMap = [
    'id',
    'id_contract',
    'id_user',
    'id_permission',
    'api_name',
  ];
  beforeAll(() => {
    dataSource = setup.dataSource;
    repository = dataSource.getRepository(UserPermissionModel);
    enterpriseModelColumns = repository.metadata.columns.map(
      (column) => column.propertyName,
    );
    atributesMap = repository.metadata.mapPropertyPathsToColumns(modelMap);
  });
  describe('validação das colunas da tabela UserPermissionModel', () => {
    it('deve verificar as colunas da tabela UserPermissionModel são compatíveis', () => {
      expect(enterpriseModelColumns).toEqual(modelMap);
    });
  });
  describe('propriedades que são únicas', () => {
    it('deve validar as propriedades que são únicas', () => {
      const uniques = atributesMap[0].entityMetadata.uniques;
      expect(uniques.length).toBe(1);
      expect(uniques[0].columns[0].databaseName).toBe('id_contract');
      expect(uniques[0].columns[1].databaseName).toBe('id_user');
      expect(uniques[0].columns[2].databaseName).toBe('id_permission');
      expect(uniques[0].columns[3]).toBeUndefined();
      expect(uniques[1]).toBeUndefined();
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
    it('id_contract', () => {
      const attr = atributesMap[1];
      expect(attr.databaseName).toBe('id_contract');
      expect(attr.isPrimary).toBeFalsy();
      expect(attr.isNullable).toBeFalsy();
      expect(attr.type).toBe('uuid');
      expect(attr.length).toBe('');
    });
    it('id_user', () => {
      const attr = atributesMap[2];
      expect(attr.databaseName).toBe('id_user');
      expect(attr.isPrimary).toBeFalsy();
      expect(attr.isNullable).toBeFalsy();
      expect(attr.type).toBe('uuid');
      expect(attr.length).toBe('');
    });
    it('id_permission', () => {
      const attr = atributesMap[3];
      expect(attr.databaseName).toBe('id_permission');
      expect(attr.isPrimary).toBeFalsy();
      expect(attr.isNullable).toBeFalsy();
      expect(new attr.type()).toBeInstanceOf(String);
      expect(attr.length).toBe('');
    });
    it('api_name', () => {
      const attr = atributesMap[4];
      expect(attr.databaseName).toBe('api_name');
      expect(attr.isPrimary).toBeFalsy();
      expect(attr.isNullable).toBeFalsy();
      expect(new attr.type()).toBeInstanceOf(String);
      expect(attr.length).toBe('');
    });
    it('undefined', () => {
      const attr = atributesMap[5];
      expect(attr).toBeUndefined();
    });
  });
  describe('validação das relações', () => {
    it('deve validar a relação com UserPermissionGroupModel', () => {
      const relations = repository.metadata.relations;
      expect(relations.length).toBe(1);
      expect(relations[0].propertyName).toBe('contract');
      expect(relations[0].isManyToOne).toBeTruthy();
    });
  });
});
