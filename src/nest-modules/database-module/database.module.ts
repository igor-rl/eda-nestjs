import { Global, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CONFIG_SCHEMA_TYPE } from '../config-module/config.module';
import { UnitOfWorkTypeORM } from '../../core/shared/infra/db/typeorm/unit-of-work-typeorm';
import { DataSource } from 'typeorm';
import { getTypeOrmConfig } from './typeorm.config-envs';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        return await getTypeOrmConfig(configService);
      },
    }),
  ],
  providers: [
    {
      provide: UnitOfWorkTypeORM,
      useFactory: (dataSource: DataSource) => {
        return new UnitOfWorkTypeORM(dataSource);
      },
      inject: [DataSource],
      scope: Scope.REQUEST,
    },
    {
      provide: 'UnitOfWork',
      useExisting: UnitOfWorkTypeORM,
      scope: Scope.REQUEST,
    },
  ],
  exports: ['UnitOfWork'],
})
export class DatabaseModule {}
