import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionModel } from '../../core/user-permission/infra/db/typeorm/user-permission.model';
import { ContractModel } from '../../core/contrato/infra/db/typeorm/contract.model';
import { RabbitmqModule } from '../rabbitmq-module/rabbitmq.module';
import { CONTRACT_PROVIDERS } from './contract.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermissionModel, ContractModel]),
    RabbitmqModule.forFeature(),
  ],
  providers: [
    ...Object.values(CONTRACT_PROVIDERS.REPOSITORIES),
    ...Object.values(CONTRACT_PROVIDERS.USE_CASES),
    ...Object.values(CONTRACT_PROVIDERS.VALIDATIONS),
    ...Object.values(CONTRACT_PROVIDERS.CONSUMERS),
  ],
  exports: [
    CONTRACT_PROVIDERS.REPOSITORIES.CONTRACT_REPOSITORY.provide,
    CONTRACT_PROVIDERS.REPOSITORIES.CONTRACT_TYPEORM_REPOSITORY.provide,
    CONTRACT_PROVIDERS.VALIDATIONS.CONTRACTS_IDS_EXISTS_IN_DATABASE_VALIDATOR
      .provide,
    CONTRACT_PROVIDERS.USE_CASES.CREATE_CONTRACT_USE_CASE.provide,
  ],
})
export class ContractsModule {}
