import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { ConfigModule } from '../../config-module/config.module';
import { DataSource } from 'typeorm';

describe('DatabaseModule Unit Tests', () => {
  describe('sqlite connection', () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_LOGGING: false,
      SYNCHRONIZE: true,
    };
    it('should be a sqlite connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const dataSource = app.get(DataSource);
      expect(dataSource).toBeDefined();
      expect(dataSource.options.type).toBe('sqlite');
      expect(dataSource.options.database).toBe(':memory:');
      expect(dataSource.options.logging).toBe(false);
      expect(dataSource.options['synchronize']).toBe(true);
      await dataSource.destroy();
    });
  });

  describe('postgres connection', () => {
    const connOptions = {
      DB_VENDOR: 'postgres',
      DB_HOST: 'db',
      DB_PORT: 5432,
      DB_USERNAME: 'pguser',
      DB_PASSWORD: 'pgpass',
      DB_DATABASE: 'permissao',
      DB_LOGGING: false,
      SYNCHRONIZE: false,
    };

    it('should be a postgres connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const dataSource = app.get(DataSource);
      expect(dataSource).toBeDefined();
      expect(dataSource.options['type']).toBe(connOptions.DB_VENDOR);
      expect(dataSource.options['host']).toBe(connOptions.DB_HOST);
      expect(dataSource.options['database']).toBe(connOptions.DB_DATABASE);
      expect(dataSource.options['username']).toBe(connOptions.DB_USERNAME);
      expect(dataSource.options['password']).toBe(connOptions.DB_PASSWORD);
      expect(dataSource.options['port']).toBe(connOptions.DB_PORT);
      expect(dataSource.options.logging).toBe(false);
      expect(dataSource.options['synchronize']).toBe(false);
      await dataSource.destroy();
    });
  });

  // describe('mysql connection', () => {
  //   const connOptions = {
  //     DB_VENDOR: 'mysql',
  //     DB_HOST: 'db',
  //     DB_PORT: 3306,
  //     DB_USERNAME: 'root',
  //     DB_PASSWORD: 'root',
  //     DB_DATABASE: 'mysql',
  //     DB_LOGGING: false,
  //     SYNCHRONIZE: true,
  //   };

  //   it('should be a mysql connection', async () => {
  //     const module = await Test.createTestingModule({
  //       imports: [
  //         DatabaseModule,
  //         ConfigModule.forRoot({
  //           isGlobal: true,
  //           ignoreEnvFile: true,
  //           ignoreEnvVars: true,
  //           validationSchema: null,
  //           load: [() => connOptions],
  //         }),
  //       ],
  //     }).compile();

  //     const app = module.createNestApplication();
  //     const dataSource = app.get(DataSource);
  //     expect(dataSource).toBeDefined();
  //     expect(dataSource.options['type']).toBe(connOptions.DB_VENDOR);
  //     expect(dataSource.options['host']).toBe(connOptions.DB_HOST);
  //     expect(dataSource.options['database']).toBe(connOptions.DB_DATABASE);
  //     expect(dataSource.options['username']).toBe(connOptions.DB_USERNAME);
  //     expect(dataSource.options['password']).toBe(connOptions.DB_PASSWORD);
  //     expect(dataSource.options['port']).toBe(connOptions.DB_PORT);
  //     await dataSource.destroy();
  //   });
  // });
});
