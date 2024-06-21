import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateUserPermissionInput } from '../../../core/user-permission/application/use-cases/create/create-user-permission.input';
import { DeleteUserPermissionUseCase } from '../../../core/user-permission/application/use-cases/delete/delete-user-permission.use-case';
import { DeleteUserPermissionInput } from '../../../core/user-permission/application/use-cases/delete/delete-user-permission.input';

type UserPermissionDisableApiConsumerProps = {
  payload: {
    id_user_permission: string;
    modulo_name: string;
  };
};

@Injectable()
export class UserPermissionDisableApiConsumer {
  constructor(private moduloRef: ModuleRef) { }
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'user-permission.removed',
    queue: 'user-permission/removed',
    allowNonJsonMessages: true,
  })
  async execute({ payload }: UserPermissionDisableApiConsumerProps) {
    if (payload?.modulo_name !== 'MODULO_EXAMPLE') return;
    const delete_permission_input = new DeleteUserPermissionInput({
      id_user_permission: payload?.id_user_permission,
    });
    try {
      await this.deleteUserPermissionInputValidade(delete_permission_input);
      await this.deleteUserPermission(delete_permission_input);
    } catch (error) {
      console.error(error);
    }
  }

  private async deleteUserPermissionInputValidade(
    input: DeleteUserPermissionInput,
  ): Promise<CreateUserPermissionInput> {
    return await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(input, {
      type: 'body',
      metatype: DeleteUserPermissionInput,
    });
  }

  private async deleteUserPermission(
    input: DeleteUserPermissionInput,
  ): Promise<void> {
    const deleteUserPermissionuseCase = await this.moduloRef.resolve(
      DeleteUserPermissionUseCase,
    );
    await deleteUserPermissionuseCase.execute(input);
  }
}
