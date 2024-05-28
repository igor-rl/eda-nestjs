import { Entity } from '../../shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { UserPermissionFakeBuilder } from './user-permission.fake-builder';

export class IdUserPermission extends Uuid {}
export class IdContract extends Uuid {}
export class IdUser extends Uuid {}

export type UserPermissionConstructorProps = {
  id_user_permission: IdUserPermission;
  id_contract: IdContract;
  id_user: IdUser;
  id_permission: string;
  api_name: string;
};

export class UserPermission extends Entity {
  _id_user_permission: IdUserPermission;
  _id_contract: IdContract;
  _id_user: IdUser;
  _id_permission: string;
  _api_name: string;

  constructor(props: UserPermissionConstructorProps) {
    super();
    this._id_user_permission = props.id_user_permission;
    this._id_contract = props.id_contract;
    this._id_user = props.id_user;
    this._id_permission = props.id_permission;
    this._api_name = props.api_name;
  }

  static create(props: UserPermissionConstructorProps) {
    const permission = new UserPermission(props);
    return permission;
  }

  get entity_id(): IdUserPermission {
    return this._id_user_permission;
  }

  get id_user_permission(): IdUserPermission {
    return this._id_user_permission;
  }

  get id_contract(): IdContract {
    return this._id_contract;
  }

  get id_user(): IdUser {
    return this._id_user;
  }

  get id_permission(): string {
    return this._id_permission;
  }

  get api_name(): string {
    return this._api_name;
  }

  static fake() {
    return UserPermissionFakeBuilder;
  }

  toJSON() {
    return {
      id_user_permission: this._id_user_permission.id,
      id_contract: this._id_contract.id,
      id_user: this._id_user.id,
      id_permission: this._id_permission,
      api_name: this._api_name,
    };
  }
}
