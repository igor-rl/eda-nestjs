import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UpdateContractInput } from '../../../core/contrato/application/use-cases/update/update-contract.input';
import { IdApi } from '../../../core/contrato/domain/contract.entity';
import { UpdateContractUseCase } from '../../../core/contrato/application/use-cases/update/update-contract.use-case';

type ApiRemovedFromContracProps = {
  payload: {
    id_contract: string;
    apis_removed: { id_api: IdApi; api_name: string }[];
  };
};

@Injectable()
export class ApiDisabledFromContractConsumer {
  constructor(private moduloRef: ModuleRef) {}
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'contract.api.removed',
    queue: 'contract/api/removed',
    allowNonJsonMessages: true,
  })
  async execute({ payload }: ApiRemovedFromContracProps) {
    if (!payload?.id_contract) return;
    if (!payload?.apis_removed?.length) return;
    const api = payload?.apis_removed.find(
      (api) => api.api_name === 'EX_API_EXAMPLE',
    );
    if (!api) return;
    const update_input = new UpdateContractInput({
      id: payload?.id_contract,
      api_active: false,
    });
    try {
      await this.updateContractInputValidade(update_input);
      await this.updateContract(update_input);
    } catch (error) {
      console.error(error);
    }
  }

  private async updateContractInputValidade(
    input: UpdateContractInput,
  ): Promise<void> {
    await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(input, {
      type: 'body',
      metatype: UpdateContractInput,
    });
  }

  private async updateContract(input: UpdateContractInput): Promise<void> {
    const updateContractuseCase = await this.moduloRef.resolve(
      UpdateContractUseCase,
    );
    await updateContractuseCase.execute(input);
  }
}
