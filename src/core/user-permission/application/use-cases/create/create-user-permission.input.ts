import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  validateSync,
} from 'class-validator';

export type CreateUserPermissionInputConstructorProps = {
  id_user_permission: string;
  id_contract: string;
  id_user: string;
  id_permission: string;
  api_name: string;
};

export class CreateUserPermissionInput {
  @IsUUID()
  @IsNotEmpty()
  id_user_permission: string;

  @IsUUID()
  @IsNotEmpty()
  id_contract: string;

  @IsUUID()
  @IsNotEmpty()
  id_user: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: 'id_permission must be an integer number',
  })
  id_permission: string;

  @IsString()
  @IsNotEmpty()
  api_name: string;

  constructor(props?: CreateUserPermissionInputConstructorProps) {
    if (!props) return;
    this.id_user_permission = props.id_user_permission;
    this.id_contract = props.id_contract;
    this.id_user = props.id_user;
    this.id_permission = props.id_permission;
    this.api_name = props.api_name;
  }
}

export class ValidateCreateUserPermissionInput {
  static validate(input: CreateUserPermissionInput) {
    return validateSync(input);
  }
}
