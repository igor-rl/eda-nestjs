import { Chance } from 'chance';
import { Contract, IdModulo, IdContract } from './contract.entity';

type PropOrFactory<T> = T | ((index: number) => T);

export class ContractFakeBuilder<TBuild = any> {
  private _id_contract: PropOrFactory<IdContract> | undefined =
    undefined ?? new IdContract();
  private _id_modulo: PropOrFactory<IdModulo> | undefined = undefined ?? new IdModulo();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _modulo_name: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _modulo_active: PropOrFactory<boolean> = (_index) => true;

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

  withIdModulo(id_modulo: PropOrFactory<IdModulo>) {
    this._id_modulo = id_modulo;
    return this;
  }

  withName(modulo_name: PropOrFactory<string>) {
    this._modulo_name = modulo_name;
    return this;
  }

  activate() {
    this._modulo_active = true;
    return this;
  }

  deactivate() {
    this._modulo_active = false;
    return this;
  }

  build(): TBuild {
    const contratos = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const contrato = new Contract({
          id_contract: this.callFactory(this.id_contract, index),
          id_modulo: this.callFactory(this.id_modulo, index),
          modulo_name: this.callFactory(this._modulo_name, index),
          modulo_active: this.callFactory(this._modulo_active, index),
        });
        contrato.validate();
        return contrato;
      });
    return this.countObjs === 1 ? (contratos[0] as any) : contratos;
  }

  get id_contract() {
    return this.getValue('id_contract');
  }

  get id_modulo() {
    return this.getValue('id_modulo');
  }

  get modulo_name() {
    return this.getValue('modulo_name');
  }

  get modulo_active() {
    return this.getValue('modulo_active');
  }

  private getValue(prop: any) {
    const optional = ['id_contract', 'id_modulo'];
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
