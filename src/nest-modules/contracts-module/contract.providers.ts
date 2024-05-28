import { DataSource } from 'typeorm';
import { ContractInMemoryRepository } from '../../core/contrato/infra/db/in-memory/contract-in-memory.repository';
import { ContractTypeOrmRepository } from '../../core/contrato/infra/db/typeorm/contract.typeorm-repository';
import { ContractModel } from '../../core/contrato/infra/db/typeorm/contract.model';
import { getDataSourceToken } from '@nestjs/typeorm';
import { IdContractExistsInDatabaseValidator } from '../../core/contrato/application/validators/contracts-ids-exists-in-database.validator';
import { IContractRepository } from '../../core/contrato/domain/contract.repository';
import { CreateContractUseCase } from '../../core/contrato/application/use-cases/create/create-contract.use-case';
import { ApiDisabledFromContractConsumer } from './consumers/contract-disabled.consumer';
import { ApiEnabledInContractConsumer } from './consumers/contract-enabled.consumer';
import { UpdateContractUseCase } from '../../core/contrato/application/use-cases/update/update-contract.use-case';

const REPOSITORIES = {
  CONTRACT_REPOSITORY: {
    provide: 'ContractRepository',
    useExisting: ContractTypeOrmRepository,
  },
  CONTRACT_IN_MEMORY_REPOSITORY: {
    provide: ContractInMemoryRepository,
    useClass: ContractInMemoryRepository,
  },
  CONTRACT_TYPEORM_REPOSITORY: {
    provide: ContractTypeOrmRepository,
    useFactory: (dataSource: DataSource) => {
      return new ContractTypeOrmRepository(
        dataSource.getRepository(ContractModel),
      );
    },
    inject: [getDataSourceToken()],
  },
};

const USE_CASES = {
  CREATE_CONTRACT_USE_CASE: {
    provide: CreateContractUseCase,
    useFactory: (repository: IContractRepository) => {
      return new CreateContractUseCase(repository);
    },
    inject: [REPOSITORIES.CONTRACT_REPOSITORY.provide],
  },
  UPDATE_CONTRACT_USE_CASE: {
    provide: UpdateContractUseCase,
    useFactory: (repository: IContractRepository) => {
      return new UpdateContractUseCase(repository);
    },
    inject: [REPOSITORIES.CONTRACT_REPOSITORY.provide],
  },
};

const VALIDATIONS = {
  CONTRACTS_IDS_EXISTS_IN_DATABASE_VALIDATOR: {
    provide: IdContractExistsInDatabaseValidator,
    useFactory: (repository: IContractRepository) => {
      return new IdContractExistsInDatabaseValidator(repository);
    },
    inject: [REPOSITORIES.CONTRACT_REPOSITORY.provide],
  },
};

const CONSUMERS = {
  ApiEnabledInContractConsumer,
  ApiDisabledFromContractConsumer,
};

export const CONTRACT_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  VALIDATIONS,
  CONSUMERS,
};
