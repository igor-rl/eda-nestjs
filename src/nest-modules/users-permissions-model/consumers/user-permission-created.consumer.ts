import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateUserPermissionInput } from '../../../core/user-permission/application/use-cases/create/create-user-permission.input';
import { CreateContractUseCase } from '../../../core/contrato/application/use-cases/create/create-contract.use-case';
import { CreateUserPermissionUseCase } from '../../../core/user-permission/application/use-cases/create/create-user-permission.use-case';
import { CreateContractInput } from '../../../core/contrato/application/use-cases/create/create-contract.input';

type UserPermissionCreatedConsumerProps = {
  payload: {
    id_user_permission: string;
    id_contract: string;
    id_user: string;
    id_permission: string;
    id_modulo: string;
    modulo_name: string;
    is_active: boolean;
  };
};

@Injectable()
export class UserPermissionCreatedConsumer {
  constructor(private moduloRef: ModuleRef) { }
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'user-permission.created',
    queue: 'user-permission/created',
    allowNonJsonMessages: true,
  })
  async execute({ payload }: UserPermissionCreatedConsumerProps) {
    console.log(payload);
    if (payload?.modulo_name !== 'MODULO_EXAMPLE') return;
    const user_permission_input = new CreateUserPermissionInput({
      id_user_permission: payload?.id_user_permission,
      id_contract: payload?.id_contract,
      id_user: payload?.id_user,
      id_permission: payload?.id_permission,
      modulo_name: payload?.modulo_name,
    });
    const contract_input = new CreateContractInput({
      id_contract: payload.id_contract,
      id_modulo: payload.id_modulo,
      modulo_name: payload.modulo_name,
      modulo_active: payload.is_active,
    });
    try {
      await this.createUserPermissionInputValidade(user_permission_input);
      await this.createContractInputValidade(contract_input);
      await this.createContract(contract_input);
      await this.createUserPermission(user_permission_input);
    } catch (error) {
      console.error(error);
    }
  }

  private async createUserPermissionInputValidade(
    input: CreateUserPermissionInput,
  ): Promise<CreateUserPermissionInput> {
    return await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(input, {
      type: 'body',
      metatype: CreateUserPermissionInput,
    });
  }

  private async createContractInputValidade(
    input: CreateContractInput,
  ): Promise<CreateContractInput> {
    return await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(input, {
      type: 'body',
      metatype: CreateContractInput,
    });
  }

  private async createContract(input: CreateContractInput): Promise<void> {
    const createContractuseCase = await this.moduloRef.resolve(
      CreateContractUseCase,
    );
    await createContractuseCase.execute(input);
  }

  private async createUserPermission(
    input: CreateUserPermissionInput,
  ): Promise<void> {
    const createUserPermissionUseCase = await this.moduloRef.resolve(
      CreateUserPermissionUseCase,
    );
    await createUserPermissionUseCase.execute(input);
  }
}
