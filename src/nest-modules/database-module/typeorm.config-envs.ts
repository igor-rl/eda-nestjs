import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CONFIG_SCHEMA_TYPE } from '../config-module/config.module';
import { UserPermissionModel } from '../../core/user-permission/infra/db/typeorm/user-permission.model';
import { ContractModel } from '../../core/contrato/infra/db/typeorm/contract.model';
import { Migrations1716558996422 } from '../../migrations/1716558996422-migrations';

export const API_ENTITIES = [UserPermissionModel, ContractModel];
export const API_MIGRATIONS = [Migrations1716558996422];

export const getTypeOrmConfig = async (
  configService: ConfigService<CONFIG_SCHEMA_TYPE>,
): Promise<TypeOrmModuleOptions> => {
  const dbVendor = await configService.get('DB_VENDOR');
  switch (dbVendor) {
    case 'sqlite':
      return {
        type: 'sqlite',
        database: ':memory:',
        entities: API_ENTITIES,
        migrations: API_MIGRATIONS,
        logging: configService.get('DB_LOGGING'),
        synchronize: configService.get('SYNCHRONIZE'),
      };
    case 'mysql':
      return {
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: API_ENTITIES,
        migrations: API_MIGRATIONS,
        logging: configService.get('DB_LOGGING'),
        synchronize: configService.get('SYNCHRONIZE'),
      };
    case 'postgres':
      return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: API_ENTITIES,
        migrations: API_MIGRATIONS,
        logging: configService.get('DB_LOGGING'),
        synchronize: configService.get('SYNCHRONIZE'),
      };
    default:
      throw new Error(`DB_VENDOR not supported: ${dbVendor}`);
  }
};
