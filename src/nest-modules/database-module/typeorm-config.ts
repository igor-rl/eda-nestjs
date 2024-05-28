import { ConfigService } from '@nestjs/config';
import { CONFIG_SCHEMA_TYPE } from '../config-module/config.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getTypeOrmConfig } from './typeorm.config-envs';

const createDataSource = async (): Promise<DataSource> => {
  const configService = new ConfigService<CONFIG_SCHEMA_TYPE>();
  const typeOrmConfig = await getTypeOrmConfig(configService);
  const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

  return dataSource;
};
export default createDataSource();
