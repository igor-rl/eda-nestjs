import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UpdateContractInput } from '../../../core/contrato/application/use-cases/update/update-contract.input';
import { IdModulo } from '../../../core/contrato/domain/contract.entity';
import { UpdateContractUseCase } from '../../../core/contrato/application/use-cases/update/update-contract.use-case';

type ApiAddedInContractProps = {
  payload: {
    id_contract: string;
    modulos_added: { id_modulo: IdModulo; modulo_name: string }[];
  };
};

@Injectable()
export class ApiEnabledInContractConsumer {
  constructor(private moduloRef: ModuleRef) { }
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'contract.api.added',
    queue: 'contract/api/added',
    allowNonJsonMessages: true,
  })
  async execute({ payload }: ApiAddedInContractProps) {
    if (!payload?.id_contract) return;
    if (!payload?.modulos_added?.length) return;
    const api = payload?.modulos_added.find(
      (api) => api.modulo_name === 'MODULO_EXAMPLE',
    );
    if (!api) return;
    const update_input = new UpdateContractInput({
      id: payload?.id_contract,
      modulo_active: true,
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
