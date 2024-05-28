import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { applyGlobalConfig } from '../../global-config';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UnitOfWorkTypeORM } from '../../../core/shared/infra/db/typeorm/unit-of-work-typeorm';

export function startApp() {
  let _app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('UnitOfWork')
      .useFactory({
        factory: (dataSource: DataSource) => {
          return new UnitOfWorkTypeORM(dataSource);
        },
        inject: [getDataSourceToken()],
      })
      .compile();

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    await _app.init();
  });

  afterEach(async () => {
    const connection = moduleFixture.get<DataSource>(getDataSourceToken());
    await connection.destroy();
    await _app?.close();
  });

  return {
    get app() {
      return _app;
    },
  };
}
