import { DataSourceOptions } from 'typeorm';
import { setupTypeORM } from '../../../../../shared/infra/testing/helpers';
import { ContractModel } from '../contract.model';

export function setupTypeOrmForContract(options: DataSourceOptions = null) {
  return setupTypeORM({
    entities: [ContractModel],
    ...options,
  });
}
