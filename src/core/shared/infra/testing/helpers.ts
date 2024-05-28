import { DataSourceOptions, DataSource } from 'typeorm';
import { Config } from '../config';

export function setupTypeORM(options: Partial<DataSourceOptions>) {
  let _dataSource: DataSource;

  beforeAll(async () => {
    _dataSource = new DataSource({
      ...Config.db(),
      ...options,
    } as DataSourceOptions);
    await _dataSource.initialize();
  });

  beforeEach(async () => await _dataSource.synchronize(true));

  afterAll(async () => {
    await _dataSource.destroy();
  });

  return {
    get dataSource() {
      return _dataSource;
    },
  };
}
