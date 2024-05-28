import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionModel } from '../../core/user-permission/infra/db/typeorm/user-permission.model';
import { ContractModel } from '../../core/contrato/infra/db/typeorm/contract.model';
import { RabbitmqModule } from '../rabbitmq-module/rabbitmq.module';
import { Module } from '@nestjs/common';
import { USERS_PERMISSIONS_PROVIDERS } from './users-permissions.providers';
import { ContractsModule } from '../contracts-module/contract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermissionModel, ContractModel]),
    RabbitmqModule.forFeature(),
    ContractsModule,
  ],
  providers: [
    ...Object.values(USERS_PERMISSIONS_PROVIDERS.REPOSITORIES),
    ...Object.values(USERS_PERMISSIONS_PROVIDERS.USE_CASES),
    ...Object.values(USERS_PERMISSIONS_PROVIDERS.VALIDATIONS),
    ...Object.values(USERS_PERMISSIONS_PROVIDERS.CONSUMERS),
  ],
  exports: [
    USERS_PERMISSIONS_PROVIDERS.REPOSITORIES.USER_PERMISSION_REPOSITORY.provide,
    USERS_PERMISSIONS_PROVIDERS.USE_CASES.FIND_USER_PERMISSION_USE_CASE.provide,
  ],
})
export class UsersPermissionsModule {}
