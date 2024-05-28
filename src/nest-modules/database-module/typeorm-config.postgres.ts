import { DataSource, DataSourceOptions } from 'typeorm';
import { API_ENTITIES, API_MIGRATIONS } from './typeorm.config-envs';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_USERNAME || 'permissao',
  username: process.env.DB_PASSWORD || 'pguser',
  password: process.env.DB_DATABASE || 'pgpass',
  logging: process.env.DB_LOGGING === 'true',
  synchronize: process.env.SYNCHRONIZE === 'false',
  migrations: API_MIGRATIONS,
  entities: API_ENTITIES,
} as DataSourceOptions);
