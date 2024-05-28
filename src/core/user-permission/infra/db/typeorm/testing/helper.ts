import { DataSourceOptions } from 'typeorm';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { UserPermissionModel } from '../user-permission.model';
import { ContractModel } from '../../../../../contrato/infra/db/typeorm/contract.model';

export function setupTypeOrmForUserPermission(
  options: DataSourceOptions = null,
) {
  return setupTypeORM({
    entities: [UserPermissionModel, ContractModel],
    ...options,
  });
}
