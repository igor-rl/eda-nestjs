import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, Matches } from 'class-validator';

export type FindUserPermissionsInputConstructorProps = {
  id_contract?: string;
  id_user?: string;
  id_permission?: string;
};

export class FindUserPermissionsInput {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id_contract?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id_user?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'id_permission must be an integer number',
  })
  id_permission?: string;

  constructor(props?: FindUserPermissionsInputConstructorProps) {
    if (!props) return;
    this.id_contract = props.id_contract;
    this.id_user = props.id_user;
    this.id_permission = props.id_permission;
  }
}
