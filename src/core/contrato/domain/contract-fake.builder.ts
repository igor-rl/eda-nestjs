import { Chance } from 'chance';
import { Contract, IdApi, IdContract } from './contract.entity';

type PropOrFactory<T> = T | ((index: number) => T);

export class ContractFakeBuilder<TBuild = any> {
  private _id_contract: PropOrFactory<IdContract> | undefined =
    undefined ?? new IdContract();
  private _id_api: PropOrFactory<IdApi> | undefined = undefined ?? new IdApi();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _api_name: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _api_active: PropOrFactory<boolean> = (_index) => true;

  private countObjs;

  static anContract() {
    return new ContractFakeBuilder<Contract>();
  }

  static theContracts(countObjs: number) {
    return new ContractFakeBuilder<Contract[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withIdContract(id: PropOrFactory<IdContract>) {
    this._id_contract = id;
    return this;
  }

  withIdApi(id_api: PropOrFactory<IdApi>) {
    this._id_api = id_api;
    return this;
  }

  withName(api_name: PropOrFactory<string>) {
    this._api_name = api_name;
    return this;
  }

  activate() {
    this._api_active = true;
    return this;
  }

  deactivate() {
    this._api_active = false;
    return this;
  }

  build(): TBuild {
    const contratos = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const contrato = new Contract({
          id_contract: this.callFactory(this.id_contract, index),
          id_api: this.callFactory(this.id_api, index),
          api_name: this.callFactory(this._api_name, index),
          api_active: this.callFactory(this._api_active, index),
        });
        contrato.validate();
        return contrato;
      });
    return this.countObjs === 1 ? (contratos[0] as any) : contratos;
  }

  get id_contract() {
    return this.getValue('id_contract');
  }

  get id_api() {
    return this.getValue('id_api');
  }

  get api_name() {
    return this.getValue('api_name');
  }

  get api_active() {
    return this.getValue('api_active');
  }

  private getValue(prop: any) {
    const optional = ['id_contract', 'id_api'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
