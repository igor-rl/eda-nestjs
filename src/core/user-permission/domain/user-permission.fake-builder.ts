import { Chance } from 'chance';
import {
  IdUserPermission,
  IdContract,
  IdUser,
  UserPermission,
} from './user-permissions.entity';

type PropOrFactory<T> = T | ((index: number) => T);

export class UserPermissionFakeBuilder<TBuild = any> {
  private _id_user_permission: PropOrFactory<IdUserPermission> | undefined =
    undefined ?? new IdUserPermission();
  private _id_contract: PropOrFactory<IdContract> | undefined =
    undefined ?? new IdContract();
  private _id_user: PropOrFactory<IdUser> | undefined =
    undefined ?? new IdUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _id_permission: PropOrFactory<string> = (_index) =>
    this.chance.integer({ min: 1, max: 100 }).toString();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _api_name: PropOrFactory<string> = (_index) => this.chance.word();

  private chance: Chance.Chance;
  private countObjs;

  static anUserPermission() {
    return new UserPermissionFakeBuilder<UserPermission>();
  }

  static theUserPermissions(countObjs: number) {
    return new UserPermissionFakeBuilder<UserPermission[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withIdUserPermission(id_user_permission: PropOrFactory<IdUserPermission>) {
    this._id_user_permission = id_user_permission;
    return this;
  }

  withIdContract(id_contract: PropOrFactory<IdContract>) {
    this._id_contract = id_contract;
    return this;
  }

  withIdUser(id_user: PropOrFactory<IdUser>) {
    this._id_user = id_user;
    return this;
  }

  withIdPermission(id_permission: PropOrFactory<string>) {
    this._id_permission = id_permission;
    return this;
  }

  withName(api_name: PropOrFactory<string>) {
    this._api_name = api_name;
    return this;
  }

  build(): TBuild {
    const users_permissions = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const user_permission = new UserPermission({
          id_user_permission: this.callFactory(this._id_user_permission, index),
          id_contract: this.callFactory(this._id_contract, index),
          id_user: this.callFactory(this._id_user, index),
          id_permission: this.callFactory(this._id_permission, index),
          api_name: this.callFactory(this._api_name, index),
        });
        return user_permission;
      });
    return this.countObjs === 1
      ? (users_permissions[0] as any)
      : users_permissions;
  }

  get id_user_permission() {
    return this.getValue('id_user_permission');
  }

  get id_contract() {
    return this.getValue('id_contract');
  }

  get id_user() {
    return this.getValue('id_user');
  }

  get id_permission() {
    return this.getValue('id_permission');
  }

  get api_name() {
    return this.getValue('api_name');
  }

  private getValue(prop: any) {
    const optional = [
      'id_user_permission',
      'id_user',
      'id_permission',
      'id_contract',
      'api_name',
    ];
    const privateProp = `_${prop}` as keyof this;
    console.log('teste de getValue', privateProp);
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
//
