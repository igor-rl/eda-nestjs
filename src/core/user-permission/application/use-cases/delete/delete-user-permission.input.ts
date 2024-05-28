import { IsNotEmpty, IsUUID, validateSync } from 'class-validator';

export type DeleteUserPermissionInputConstructorProps = {
  id_user_permission: string;
};

export class DeleteUserPermissionInput {
  @IsUUID()
  @IsNotEmpty()
  id_user_permission: string;

  constructor(props?: DeleteUserPermissionInputConstructorProps) {
    if (!props) return;
    this.id_user_permission = props.id_user_permission;
  }
}

export class ValidateDeleteUserPermissionInput {
  static validate(input: DeleteUserPermissionInput) {
    return validateSync(input);
  }
}
