import { DataSource, DataSourceOptions } from 'typeorm';
import { API_ENTITIES, API_MIGRATIONS } from './typeorm.config-envs';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'eda_db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'pguser',
  password: process.env.DB_PASSWORD || 'pgpass',
  database: process.env.DB_DATABASE || 'eda',
  logging: process.env.DB_LOGGING === 'true',
  synchronize: process.env.SYNCHRONIZE === 'false',
  migrations: API_MIGRATIONS,
  entities: API_ENTITIES,
} as DataSourceOptions);
