import { DataSource } from 'typeorm';
import { UserPermissionInMemoryRepository } from '../../core/user-permission/infra/db/in-memory/user-permission.in-memory-repository';
import { UserPermissionTypeOrmRepository } from '../../core/user-permission/infra/db/typeorm/user-permission.typeorm-repository';
import { UserPermissionModel } from '../../core/user-permission/infra/db/typeorm/user-permission.model';
import { getDataSourceToken } from '@nestjs/typeorm';
import { CreateUserPermissionUseCase } from '../../core/user-permission/application/use-cases/create/create-user-permission.use-case';
import { IUserPermissionRepository } from '../../core/user-permission/domain/user-permission-interface.repository';
import { IdContractExistsInDatabaseValidator } from '../../core/contrato/application/validators/contracts-ids-exists-in-database.validator';
import { ContractTypeOrmRepository } from '../../core/contrato/infra/db/typeorm/contract.typeorm-repository';
import { CONTRACT_PROVIDERS } from '../contracts-module/contract.providers';
import { DeleteUserPermissionUseCase } from '../../core/user-permission/application/use-cases/delete/delete-user-permission.use-case';
import { FindUserPermissionsUseCase } from '../../core/user-permission/application/use-cases/find/find-user-permissions.use-case';
import { CreateContractUseCase } from '../../core/contrato/application/use-cases/create/create-contract.use-case';
import { IContractRepository } from '../../core/contrato/domain/contract.repository';
import { UserPermissionCreatedConsumer } from './consumers/user-permission-created.consumer';
import { UserPermissionDisableApiConsumer } from './consumers/user-permission-removed.consumer';

const REPOSITORIES = {
  USER_PERMISSION_REPOSITORY: {
    provide: 'UserPermissionRepository',
    useExisting: UserPermissionTypeOrmRepository,
  },
  USER_PERMISSION_IN_MEMORY_REPOSITORY: {
    provide: UserPermissionInMemoryRepository,
    useClass: UserPermissionInMemoryRepository,
  },
  USER_PERMISSION_TYPEORM_REPOSITORY: {
    provide: UserPermissionTypeOrmRepository,
    useFactory: (dataSource: DataSource) => {
      return new UserPermissionTypeOrmRepository(
        dataSource.getRepository(UserPermissionModel),
      );
    },
    inject: [getDataSourceToken()],
  },
};

const VALIDATIONS = {
  ID_CONTRACT_EXISTS_IN_DATABASE_VALIDATOR: {
    provide: IdContractExistsInDatabaseValidator,
    useFactory: (repository: ContractTypeOrmRepository) => {
      return new IdContractExistsInDatabaseValidator(repository);
    },
    inject: [CONTRACT_PROVIDERS.REPOSITORIES.CONTRACT_REPOSITORY.provide],
  },
};

const USE_CASES = {
  CREATE_USER_PERMISSION_USE_CASE: {
    provide: CreateUserPermissionUseCase,
    useFactory: (
      repository: IUserPermissionRepository,
      validateIdContract: IdContractExistsInDatabaseValidator,
      findUserPermissionsUseCase: FindUserPermissionsUseCase,
    ) => {
      return new CreateUserPermissionUseCase(
        repository,
        validateIdContract,
        findUserPermissionsUseCase,
      );
    },
    inject: [
      REPOSITORIES.USER_PERMISSION_REPOSITORY.provide,
      CONTRACT_PROVIDERS.VALIDATIONS.CONTRACTS_IDS_EXISTS_IN_DATABASE_VALIDATOR
        .provide,
      FindUserPermissionsUseCase,
    ],
  },
  DELETE_USER_PERMISSION_USE_CASE: {
    provide: DeleteUserPermissionUseCase,
    useFactory: (repository: IUserPermissionRepository) => {
      return new DeleteUserPermissionUseCase(repository);
    },
    inject: [REPOSITORIES.USER_PERMISSION_REPOSITORY.provide],
  },
  FIND_USER_PERMISSION_USE_CASE: {
    provide: FindUserPermissionsUseCase,
    useFactory: (repository: IUserPermissionRepository) => {
      return new FindUserPermissionsUseCase(repository);
    },
    inject: [REPOSITORIES.USER_PERMISSION_REPOSITORY.provide],
  },
  CREATE_CONTRACT_USE_CASE: {
    provide: CreateContractUseCase,
    useFactory: (repository: IContractRepository) => {
      return new CreateContractUseCase(repository);
    },
    inject: [CONTRACT_PROVIDERS.REPOSITORIES.CONTRACT_REPOSITORY.provide],
  },
};

const CONSUMERS = {
  UserPermissionCreatedConsumer,
  UserPermissionDisableApiConsumer,
};

export const USERS_PERMISSIONS_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  VALIDATIONS,
  CONSUMERS,
};
